
export interface SavedPreferences {
  tag_preferences: string | null;
  min_distance_preferences: string | null;
  max_distance_preferences: string | null;
  options_tag_preferences: string | null;
  profile_options_tag_preferences: string | null;
  location_coordinates: number[] | null;
  current_pois: string | null;
  selected_profile: string | null;
  checkbox_selected: boolean | null;
  tab_view_active_index: number | null;
}
