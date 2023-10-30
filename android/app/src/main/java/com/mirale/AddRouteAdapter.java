package com.mirale;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.mirale.R;

import com.mappls.sdk.services.api.autosuggest.model.ELocation;

import java.util.List;

public class AddRouteAdapter extends RecyclerView.Adapter<AddRouteAdapter.ViewHolder> {

    private List<ELocation> eLocations;
    private AddRouteListener addRouteListener;
    private boolean shownextBlankLocation = false;

    public void setShowNextBlankLocation(boolean shownextBlankLocation) {
        this.shownextBlankLocation = shownextBlankLocation;
        notifyDataSetChanged();
    }

    public void setAddRouteListener(AddRouteListener addRouteListener) {
        this.addRouteListener = addRouteListener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View itemLayoutView = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.add_route_text, viewGroup, false);
        return new ViewHolder(itemLayoutView);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {

        if (i < eLocations.size()) {
            if (i == eLocations.size() - 1) {
                viewHolder.imageViewRemove.setVisibility(View.GONE);
                viewHolder.imageViewAdd.setVisibility(shownextBlankLocation ? View.INVISIBLE : View.VISIBLE);
            } else {
                viewHolder.imageViewRemove.setVisibility(View.VISIBLE);
                viewHolder.imageViewAdd.setVisibility(View.GONE);
            }
            viewHolder.textViewTo.setText(eLocations.get(i).placeName);

        } else {
            viewHolder.imageViewRemove.setVisibility(View.GONE);
            viewHolder.imageViewAdd.setVisibility(View.INVISIBLE);
        }

        viewHolder.imageViewRemove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addRouteListener.onRemoveRoute(viewHolder.getAdapterPosition());
            }
        });

        viewHolder.imageViewAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addRouteListener.onAddRoute();
            }
        });

        viewHolder.textViewTo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addRouteListener.onClickRouteText(viewHolder.getAdapterPosition());
            }
        });
    }

    public void updateList(List<ELocation> eLocations) {
        shownextBlankLocation = false;
        this.eLocations = eLocations;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {

        if (eLocations == null) {
            return shownextBlankLocation ? 1 : 0;
        }
        return shownextBlankLocation ? eLocations.size() + 1 : eLocations.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {

        private TextView textViewTo;
        private ImageView imageViewAdd;
        private ImageView imageViewRemove;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            textViewTo = itemView.findViewById(R.id.text_view_to);
            imageViewAdd = itemView.findViewById(R.id.image_view_plus);
            imageViewRemove = itemView.findViewById(R.id.image_view_remove);
        }
    }

    public interface AddRouteListener {
        void onAddRoute();

        void onClickRouteText(int position);

        void onRemoveRoute(int position);
    }
}
