
// Org Profile Page View Model
export interface OrgProfileViewModel {
    id:           string;
    name:         string;
    profileImage: string;
    phone1:       string;
    created_at:   string;
}


// Org Profile Detail Model
export interface OrgProfileDetailModel {
    name:         string;
    profileImage: string;
    phone1:       string;
    phone2:       string;
    website:      string;
    bio:          string;
    country:      string;
}
