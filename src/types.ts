import { z } from 'zod';

export interface Plant {
  id: string;
  name: string;
  species: string;
  acquisitionDate: string; // ISO date string
  notes?: string;
  imageDataUrl?: string; // Stores base64 image data
  lastWatered?: string; // ISO date string
  plantType?: string; // e.g., "Alocasia", "Philodendron"
  parentPlantId?: string; // For tracking cuttings/lineage
  comments?: Comment[]; // Care log comments
}

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: string; // ISO date string
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

// Zod Schema for Plant Form Validation
export const PlantFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  species: z.string().min(1, "Species is required").max(100, "Species must be 100 characters or less"),
  plantType: z.string()
    .trim()
    .max(50, "Plant type must be 50 characters or less")
    .optional()
    .transform(val => (val === undefined || val.trim() === "") ? "Uncategorized" : val.trim()),
  acquisitionDate: z.string()
    .min(1, "Acquisition date is required")
    .refine(date => !isNaN(new Date(date).getTime()), "Invalid date format")
    .refine(date => {
      try {
        return new Date(date) <= new Date(new Date().setHours(23,59,59,999)); // Allow today
      } catch { return false; }
    }, "Acquisition date cannot be in the future"),
  lastWatered: z.string().optional().nullable()
    .refine(date => !date || !isNaN(new Date(date).getTime()), "Invalid date format for last watered")
    .refine(date => !date || new Date(date) <= new Date(new Date().setHours(23,59,59,999)), "Last watered date cannot be in the future"),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
  imageDataUrl: z.string().optional(),
  parentPlantId: z.string().optional(), // For cuttings
  cuttingCount: z.number().min(1).max(10).optional(), // For bulk cuttings (1-10)
}).superRefine((data, ctx) => {
  if (data.lastWatered && data.acquisitionDate) {
    try {
      if (new Date(data.lastWatered) < new Date(data.acquisitionDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Last watered date cannot be before acquisition date",
          path: ["lastWatered"],
        });
      }
    } catch {
      // Invalid date parsing will be caught by field-level refinements
    }
  }
});

export type PlantFormData = z.infer<typeof PlantFormSchema>;

// Routing related types
export type Route = 
  | { path: 'home' } 
  | { path: 'plants'; filter?: string } 
  | { path: 'pests' }
  | { path: 'fertilizer' }
  | { path: 'soil' }
  | { path: 'not-found' };

export interface PageProps {
  plantTypeFilter?: string; 
}

// --- Plant Store Types ---
export interface PlantState {
  plants: Plant[];
  isLoading: boolean;
  error: string | null;
  dynamicPlantTypes: string[];
}

// --- Modal System Types ---
export interface PlantFormModalPayload {
  plant?: Plant | null; // For editing
  parentPlant?: Plant | null; // For creating cuttings
  mode?: 'edit' | 'add' | 'cutting'; // Form mode
}
export interface PlantDetailModalPayload {
  plant: Plant;
}
export interface ConfirmationModalPayload {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export type ModalType = 'plantForm' | 'plantDetail' | 'confirmation';

export interface ModalConfig<T = any> {
  type: ModalType;
  payload?: T;
}

export interface ModalContextType {
  isOpen: boolean;
  config: ModalConfig | null;
  openModal: <T>(type: ModalType, payload?: T) => void;
  closeModal: () => void;
}

// --- Service Response Types ---
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

export interface GeminiCareTipsResponse {
  text: string;
  sources?: GroundingMetadata;
}
