package com.mirale.maps.traffic;

import static com.mappls.sdk.maps.style.expressions.Expression.get;
import static com.mappls.sdk.maps.style.expressions.Expression.interpolate;
import static com.mappls.sdk.maps.style.expressions.Expression.literal;
import static com.mappls.sdk.maps.style.expressions.Expression.match;
import static com.mappls.sdk.maps.style.expressions.Expression.toColor;
import static com.mappls.sdk.maps.style.layers.PropertyFactory.lineCap;
import static com.mappls.sdk.maps.style.layers.PropertyFactory.lineColor;
import static com.mappls.sdk.maps.style.layers.PropertyFactory.lineJoin;
import static com.mappls.sdk.maps.style.layers.PropertyFactory.lineOffset;
import static com.mappls.sdk.maps.style.layers.PropertyFactory.lineOpacity;
import static com.mappls.sdk.maps.style.layers.PropertyFactory.lineWidth;
import static com.mappls.sdk.maps.style.layers.PropertyFactory.visibility;
import static java.lang.Math.asin;
import static java.lang.Math.atan2;
import static java.lang.Math.cos;
import static java.lang.Math.sin;
import static java.lang.Math.toDegrees;
import static java.lang.Math.toRadians;

import android.graphics.Color;
import android.os.Handler;

import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;

import com.google.gson.JsonObject;
import com.mappls.sdk.maps.MapView;
import com.mappls.sdk.maps.MapplsMap;
import com.mappls.sdk.maps.Style;
import com.mappls.sdk.maps.geometry.LatLng;
import com.mappls.sdk.maps.geometry.LatLngBounds;
import com.mappls.sdk.maps.style.expressions.Expression;
import com.mappls.sdk.maps.style.layers.Layer;
import com.mappls.sdk.maps.style.layers.LineLayer;
import com.mappls.sdk.maps.style.layers.Property;
import com.mappls.sdk.maps.style.sources.GeoJsonSource;
import com.mappls.sdk.maps.style.sources.Source;
import com.mappls.sdk.maps.utils.ColorUtils;
import com.mappls.sdk.services.account.MapplsAccountManager;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import timber.log.Timber;

public final class TrafficPlugin implements MapView.OnDidFinishLoadingStyleListener, MapView.OnCameraDidChangeListener {
    private static final double EARTH_RADIUS = 6371009;
    private Handler handler = new Handler();
    private Call<JsonObject> stringCall = null;
    private MapplsMap mapplsMap;
    private Runnable callTrafficAPI = this::hitTrafficAPi;
    private List<String> layerIds;
    private boolean enabled;

    /**
     * Create a traffic plugin.
     *
     * @param mapView   the MapView to apply the traffic plugin to
     * @param mapplsMap the MapboxMap to apply traffic plugin with
     */
    public TrafficPlugin(@NonNull MapView mapView, @NonNull MapplsMap mapplsMap) {
        this.mapplsMap = mapplsMap;
        updateState();
        mapView.addOnDidFinishLoadingStyleListener(this);
        mapView.addOnCameraDidChangeListener(this);
    }

    /**
     * Returns the LatLng resulting from moving a distance from an origin
     * in the specified heading (expressed in degrees clockwise from north).
     *
     * @param from     The LatLng from which to start.
     * @param distance The distance to travel.
     * @param heading  The heading in degrees clockwise from north.
     */
    private static LatLng computeOffset(LatLng from, double distance, double heading) {
        distance /= EARTH_RADIUS;
        heading = toRadians(heading);
        // http://williams.best.vwh.net/avform.htm#LL
        double fromLat = toRadians(from.getLatitude());
        double fromLng = toRadians(from.getLongitude());
        double cosDistance = cos(distance);
        double sinDistance = sin(distance);
        double sinFromLat = sin(fromLat);
        double cosFromLat = cos(fromLat);
        double sinLat = cosDistance * sinFromLat + sinDistance * cosFromLat * cos(heading);
        double dLng = atan2(
                sinDistance * cosFromLat * sin(heading),
                cosDistance - sinFromLat * sinLat);
        return new LatLng(toDegrees(asin(sinLat)), toDegrees(fromLng + dLng));
    }

    /**
     * Returns true if the traffic plugin is currently enabled.
     *
     * @return true if enabled, false otherwise
     */
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        if (enabled != this.enabled) {
            this.enabled = enabled;
            updateState();
        }
        if (enabled) {
            scheduleAPICall();
        }
    }

    /**
     * Toggles the traffic plugin state.
     * <p>
     * If the traffic plugin wasn't initialised yet, traffic source and layers will be added to the current map style.
     * Else visibility will be toggled based on the current state.
     * </p>
     */
    public void toggle() {
        enabled = !enabled;
        updateState();
    }

    @Override
    public void onDidFinishLoadingStyle() {
        updateState();
        if (isEnabled())
            scheduleAPICall();
    }

    @Override
    public void onCameraDidChange(boolean b) {
        scheduleAPICall();
    }

    private void scheduleAPICall() {
        handler.removeCallbacksAndMessages(null);
        if (stringCall != null && stringCall.isExecuted())
            stringCall.cancel();
        handler.postDelayed(callTrafficAPI, 400);
    }

    /**
     * Update the state of the traffic plugin.
     */
    private void updateState() {
        mapplsMap.getStyle(new Style.OnStyleLoaded() {
            @Override
            public void onStyleLoaded(@NonNull Style style) {
                Source source = style.getSource(TrafficData.SOURCE_ID);
                if (source == null) {
                    initialise(style);
                    return;
                }
                setVisibility(enabled, style);
            }
        });
    }

    /**
     * Initialise the traffic source and layers.
     * @param style
     */
    private void initialise(Style style) {
        layerIds = new ArrayList<>();
        addTrafficSource(style);
        addTrafficLayers(style);
    }

    /**
     * Adds traffic source to the map.
     * @param style
     */
    private void addTrafficSource(Style style) {
        GeoJsonSource trafficSource = new GeoJsonSource(TrafficData.SOURCE_ID);
        style.addSource(trafficSource);
    }

    /**
     * Adds traffic layers to the map.
     * @param style
     */
    private void addTrafficLayers(Style style) {
        try {
            addLocalLayer(style);
        } catch (Exception exception) {
            Timber.e(exception);
            Timber.e("Unable to attach Traffic Layers to current style.");
        }
    }

    /**
     * Add local layer to the map.
     * @param style
     */
    private void addLocalLayer(Style style) {
        LineLayer local = TrafficLayer.getLineLayer(
                Local.BASE_LAYER_ID,
                /*Local.ZOOM_LEVEL*/0,
                /*Local.FILTER*/null,
                Local.FUNCTION_LINE_COLOR,
                Local.FUNCTION_LINE_WIDTH,
                /*Local.FUNCTION_LINE_OFFSET*/null
        );
        LineLayer localCase = TrafficLayer.getLineLayer(
                Local.LOCAL_CASE_LAYER_ID,
                /*Local.ZOOM_LEVEL*/0,
                /*Local.FILTER*/null,
                Local.FUNCTION_LINE_COLOR_CASE,
                Local.FUNCTION_LINE_WIDTH_CASE,
                /*Local.FUNCTION_LINE_OFFSET*/null,
                Local.FUNCTION_LINE_OPACITY_CASE
        );
        // #TODO https://github.com/mapbox/mapbox-plugins-android/issues/14
        addTrafficLayersToMap(localCase, local, "water_str_lbl", style);
    }

    /**
     * Returns the last added layer id.
     *
     * @return the id of the last added layer
     */
    private String getLastAddedLayerId() {
        return layerIds.get(layerIds.size() - 1);
    }

    /**
     * Add Layer to the map and track the id.
     *  @param layer        the layer to be added to the map
     * @param idBelowLayer the id of the layer above
     * @param style
     */
    private void addTrafficLayersToMap(Layer layerCase, Layer layer, String idBelowLayer, Style style) {
        if (style.getLayer(idBelowLayer) != null)
            style.addLayerBelow(layerCase, idBelowLayer);
        else
            style.addLayer(layerCase);
        style.addLayerAbove(layer, layerCase.getId());
        layerIds.add(layerCase.getId());
        layerIds.add(layer.getId());
    }

    /**
     * Toggles the visibility of the traffic layers.
     *
     * @param visible true for visible, false for none
     * @param style
     */
    private void setVisibility(boolean visible, Style style) {
        if (layerIds == null)
            return;
        List<Layer> layers = style.getLayers();
        for (Layer layer : layers) {
            if (layerIds.contains(layer.getId())) {
                layer.setProperties(visibility(visible ? Property.VISIBLE : Property.NONE));
            }
        }
    }

    public LatLngBounds toBounds(LatLng center, double radiusInMeters) {
        double distanceFromCenterToCorner = radiusInMeters * Math.sqrt(2.0);
        LatLng southwestCorner =
                computeOffset(center, distanceFromCenterToCorner, 225.0);
        LatLng northeastCorner =
                computeOffset(center, distanceFromCenterToCorner, 45.0);
        return LatLngBounds.from(northeastCorner.getLatitude(), northeastCorner.getLongitude(), southwestCorner.getLatitude(), southwestCorner.getLongitude());
    }

    private void hitTrafficAPi() {
        LatLngBounds boundingBox = mapplsMap.getProjection().getVisibleRegion().latLngBounds;
        int zoom = (int) mapplsMap.getCameraPosition().zoom;
        try {
            LatLngBounds bounds = toBounds(boundingBox.getCenter(), boundingBox.getNorthEast().distanceTo(boundingBox.getCenter()));
            if (zoom < 10)
                return;
            BoundingBox boundingBox1 = new BoundingBox(
                    bounds.getLatSouth()//miny
                    , bounds.getLonWest()//minx
                    , bounds.getLatNorth()//maxy
                    , bounds.getLonEast()//maxy
            );
            if(mapplsMap.getStyle() != null && mapplsMap.getStyle().isFullyLoaded()) {
                Source source = mapplsMap.getStyle().getSource(TrafficData.SOURCE_ID);
                if (source != null) {
                    ((GeoJsonSource) source).setUri(getUrl(boundingBox1, zoom));
                }
            }
        } catch (IllegalArgumentException e) {
            // Timber.e(e);
        } catch (Exception e) {
            // Timber.e(e);
        }
    }

    private String getUrl(BoundingBox boundingBox, int zoom) {
        StringBuilder builder = new StringBuilder("https://apis.mappls.com/advancedmaps/v1/");
        builder.append(MapplsAccountManager.getInstance().getRestAPIKey());
        builder.append("/traffic_geo_json?");
        builder.append("minx=");
        builder.append(boundingBox.getMinX());
        builder.append("&maxx=");
        builder.append(boundingBox.getMaxX());
        builder.append("&maxy=");
        builder.append(boundingBox.getMaxY());
        builder.append("&miny=");
        builder.append(boundingBox.getMinY());
        builder.append("&zoom=");
        builder.append(zoom);
        return builder.toString();
    }


    private static class TrafficLayer {
        static LineLayer getLineLayer(String lineLayerId, float minZoom, Expression statement,
                                      Expression lineColor, Expression lineWidth, Expression lineOffset) {
            return getLineLayer(lineLayerId, minZoom, statement, lineColor, lineWidth, lineOffset, null);
        }

        static LineLayer getLineLayer(String lineLayerId, float minZoom, Expression statement,
                                      Expression lineColorExpression, Expression lineWidthExpression,
                                      Expression lineOffsetExpression, Expression lineOpacityExpression) {
            LineLayer lineLayer = new LineLayer(lineLayerId, TrafficData.SOURCE_ID);
            lineLayer.setSourceLayer(TrafficData.SOURCE_LAYER);
            lineLayer.setProperties(
                    lineCap(Property.LINE_CAP_ROUND),
                    lineJoin(Property.LINE_JOIN_ROUND),
                    lineColor(lineColorExpression),
                    lineWidth(lineWidthExpression),
                    lineOffset(lineOffsetExpression)
            );
            if (lineOpacityExpression != null) {
                lineLayer.setProperties(lineOpacity(lineOpacityExpression));
            }
            if (statement != null)
                lineLayer.setFilter(statement);
            lineLayer.setMinZoom(minZoom);
            return lineLayer;
        }
    }

    private static class TrafficFunction {
        static Expression getLineColorFunction(@ColorInt int low, @ColorInt int moderate, @ColorInt int heavy,
                                               @ColorInt int severe) {
            return match(get("tType"), toColor(literal(ColorUtils.colorToRgbaString(Color.TRANSPARENT))),
                    Expression.stop("fast", toColor(literal(ColorUtils.colorToRgbaString(low)))),
                    Expression.stop("medium", toColor(literal(ColorUtils.colorToRgbaString(moderate)))),
                    Expression.stop("slow", toColor(literal(ColorUtils.colorToRgbaString(heavy)))),
                    Expression.stop("severe", toColor(literal(ColorUtils.colorToRgbaString(severe)))));
        }
    }

    private static class TrafficData {
        private static final String SOURCE_ID = "traffic";
        private static final String SOURCE_LAYER = "traffic";
    }

    private static class TrafficType {
        static final Expression FUNCTION_LINE_COLOR = TrafficFunction.getLineColorFunction(TrafficColor.BASE_GREEN,
                TrafficColor.BASE_YELLOW, TrafficColor.BASE_ORANGE, TrafficColor.BASE_RED);
        static final Expression FUNCTION_LINE_COLOR_CASE = TrafficFunction.getLineColorFunction(
                TrafficColor.CASE_GREEN, TrafficColor.CASE_YELLOW, TrafficColor.CASE_ORANGE, TrafficColor.CASE_RED);
    }

    private static class Local extends TrafficType {
        static final Expression FUNCTION_LINE_WIDTH = interpolate(Expression.exponential(1.5f), Expression.zoom(),
                Expression.stop(14, 1.5f),
                Expression.stop(20, 10.5f)
        );
        static final Expression FUNCTION_LINE_WIDTH_CASE = interpolate(Expression.exponential(1.5f), Expression.zoom(),
                Expression.stop(14, 2.5f),
                Expression.stop(20, 12.5f)
        );
        static final Expression FUNCTION_LINE_OFFSET = interpolate(Expression.exponential(1.5f), Expression.zoom(),
                Expression.stop(14, 2f),
                Expression.stop(20, 18f)
        );
        static final Expression FUNCTION_LINE_OPACITY_CASE = interpolate(Expression.exponential(1.0f), Expression.zoom(),
                Expression.stop(15, 0.0f),
                Expression.stop(16, 1.0f)
        );
        private static final String BASE_LAYER_ID = "traffic-local";
        private static final String LOCAL_CASE_LAYER_ID = "traffic-local-case";
        private static final float ZOOM_LEVEL = 15.0f;
    }

    private static class TrafficColor {
        private static final int BASE_GREEN = Color.parseColor("#39c66d");
        private static final int CASE_GREEN = Color.parseColor("#059441");
        private static final int BASE_YELLOW = Color.parseColor("#ff8c1a");
        private static final int CASE_YELLOW = Color.parseColor("#d66b00");
        private static final int BASE_ORANGE = Color.parseColor("#ff0015");
        private static final int CASE_ORANGE = Color.parseColor("#bd0010");
        private static final int BASE_RED = Color.parseColor("#981b25");
        private static final int CASE_RED = Color.parseColor("#5f1117");
    }
}