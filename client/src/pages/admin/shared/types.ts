export interface AdminData {
  products: any[];
  users: any[];
  orders: any[];
  analytics: any;
  settings: any;
  aboutHero: {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage: string;
    isActive?: boolean;
  };
  aboutJourneyImage: string;
  visionMission: any;
  heroSlides: any[];
  offerings: any[];
  statistics: any[];
  regulatoryApprovals: any[];
  aboutSections: any[];
  leadership: any[];
  values: any[];
  journey: any[];
  capabilitiesFacilities: any[];
  capabilitiesHero: any;
}

export interface CMSComponentProps {
  user: any;
  token: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'add' | 'edit';
  setModalType: (type: 'add' | 'edit') => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (item: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  authHeaders: () => Record<string, string>;
}

