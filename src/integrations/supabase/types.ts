export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string;
          created_at: string;
          customer_id: string;
          designer_id: string | null;
          id: string;
          notes: string | null;
          order_id: string | null;
          status: Database["public"]["Enums"]["appointment_status"];
          time_slot: string;
          type: Database["public"]["Enums"]["appointment_type"];
        };
        Insert: {
          appointment_date: string;
          created_at?: string;
          customer_id: string;
          designer_id?: string | null;
          id?: string;
          notes?: string | null;
          order_id?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"];
          time_slot: string;
          type?: Database["public"]["Enums"]["appointment_type"];
        };
        Update: {
          appointment_date?: string;
          created_at?: string;
          customer_id?: string;
          designer_id?: string | null;
          id?: string;
          notes?: string | null;
          order_id?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"];
          time_slot?: string;
          type?: Database["public"]["Enums"]["appointment_type"];
        };
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "public_designer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_designer_id_fkey";
            columns: ["designer_id"];
            isOneToOne: false;
            referencedRelation: "designers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      custom_order_files: {
        Row: {
          file_name: string;
          file_size: number | null;
          file_type: string | null;
          id: string;
          kind: string | null;
          order_id: string;
          storage_path: string;
          uploaded_at: string;
        };
        Insert: {
          file_name: string;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          kind?: string | null;
          order_id: string;
          storage_path: string;
          uploaded_at?: string;
        };
        Update: {
          file_name?: string;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          kind?: string | null;
          order_id?: string;
          storage_path?: string;
          uploaded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "custom_order_files_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "custom_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      custom_order_messages: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          order_id: string;
          sender: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          order_id: string;
          sender?: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          order_id?: string;
          sender?: string;
        };
        Relationships: [
          {
            foreignKeyName: "custom_order_messages_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "custom_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      custom_order_payments: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          id: string;
          order_id: string;
          paid_at: string | null;
          payment_method: string | null;
          payment_status: Database["public"]["Enums"]["custom_payment_status"];
          transaction_reference: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          id?: string;
          order_id: string;
          paid_at?: string | null;
          payment_method?: string | null;
          payment_status?: Database["public"]["Enums"]["custom_payment_status"];
          transaction_reference?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          order_id?: string;
          paid_at?: string | null;
          payment_method?: string | null;
          payment_status?: Database["public"]["Enums"]["custom_payment_status"];
          transaction_reference?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "custom_order_payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "custom_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      custom_orders: {
        Row: {
          clothing_type: string | null;
          color: string | null;
          color_notes: string | null;
          created_at: string;
          currency: string;
          customer_id: string | null;
          customizations: string[];
          delivery_address: string | null;
          description: string | null;
          email: string;
          event_date: string | null;
          event_type: string | null;
          expected_completion: string | null;
          fabric_preference: string | null;
          full_name: string;
          id: string;
          internal_notes: string | null;
          measurement_unit: string;
          measurements: Json;
          needs_measurement_help: boolean;
          order_number: string;
          order_type: string;
          payment_status: Database["public"]["Enums"]["custom_payment_status"];
          phone: string;
          preferred_contact: string;
          price: number | null;
          required_date: string | null;
          selected_design: string | null;
          special_instructions: string | null;
          status: Database["public"]["Enums"]["custom_order_status"];
          updated_at: string;
          urgency: string | null;
          whatsapp: string | null;
        };
        Insert: {
          clothing_type?: string | null;
          color?: string | null;
          color_notes?: string | null;
          created_at?: string;
          currency?: string;
          customer_id?: string | null;
          customizations?: string[];
          delivery_address?: string | null;
          description?: string | null;
          email: string;
          event_date?: string | null;
          event_type?: string | null;
          expected_completion?: string | null;
          fabric_preference?: string | null;
          full_name: string;
          id?: string;
          internal_notes?: string | null;
          measurement_unit?: string;
          measurements?: Json;
          needs_measurement_help?: boolean;
          order_number: string;
          order_type?: string;
          payment_status?: Database["public"]["Enums"]["custom_payment_status"];
          phone: string;
          preferred_contact?: string;
          price?: number | null;
          required_date?: string | null;
          selected_design?: string | null;
          special_instructions?: string | null;
          status?: Database["public"]["Enums"]["custom_order_status"];
          updated_at?: string;
          urgency?: string | null;
          whatsapp?: string | null;
        };
        Update: {
          clothing_type?: string | null;
          color?: string | null;
          color_notes?: string | null;
          created_at?: string;
          currency?: string;
          customer_id?: string | null;
          customizations?: string[];
          delivery_address?: string | null;
          description?: string | null;
          email?: string;
          event_date?: string | null;
          event_type?: string | null;
          expected_completion?: string | null;
          fabric_preference?: string | null;
          full_name?: string;
          id?: string;
          internal_notes?: string | null;
          measurement_unit?: string;
          measurements?: Json;
          needs_measurement_help?: boolean;
          order_number?: string;
          order_type?: string;
          payment_status?: Database["public"]["Enums"]["custom_payment_status"];
          phone?: string;
          preferred_contact?: string;
          price?: number | null;
          required_date?: string | null;
          selected_design?: string | null;
          special_instructions?: string | null;
          status?: Database["public"]["Enums"]["custom_order_status"];
          updated_at?: string;
          urgency?: string | null;
          whatsapp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "custom_orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "custom_orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "public_designer_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      design_uploads: {
        Row: {
          created_at: string;
          customer_id: string;
          id: string;
          image_url: string;
          notes: string | null;
          order_id: string | null;
        };
        Insert: {
          created_at?: string;
          customer_id: string;
          id?: string;
          image_url: string;
          notes?: string | null;
          order_id?: string | null;
        };
        Update: {
          created_at?: string;
          customer_id?: string;
          id?: string;
          image_url?: string;
          notes?: string | null;
          order_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "design_uploads_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "design_uploads_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "public_designer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "design_uploads_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      designers: {
        Row: {
          created_at: string;
          headline: string | null;
          hourly_rate: number | null;
          id: string;
          is_approved: boolean;
          portfolio_images: string[] | null;
          profile_id: string;
          rating: number | null;
          specialties: string[] | null;
          years_experience: number | null;
        };
        Insert: {
          created_at?: string;
          headline?: string | null;
          hourly_rate?: number | null;
          id?: string;
          is_approved?: boolean;
          portfolio_images?: string[] | null;
          profile_id: string;
          rating?: number | null;
          specialties?: string[] | null;
          years_experience?: number | null;
        };
        Update: {
          created_at?: string;
          headline?: string | null;
          hourly_rate?: number | null;
          id?: string;
          is_approved?: boolean;
          portfolio_images?: string[] | null;
          profile_id?: string;
          rating?: number | null;
          specialties?: string[] | null;
          years_experience?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "designers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "designers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "public_designer_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          attachment_url: string | null;
          body: string;
          created_at: string;
          id: string;
          order_id: string;
          sender_id: string;
        };
        Insert: {
          attachment_url?: string | null;
          body: string;
          created_at?: string;
          id?: string;
          order_id: string;
          sender_id: string;
        };
        Update: {
          attachment_url?: string | null;
          body?: string;
          created_at?: string;
          id?: string;
          order_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "public_designer_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_updates: {
        Row: {
          author_id: string;
          created_at: string;
          id: string;
          image_url: string | null;
          note: string | null;
          order_id: string;
          stage: string;
        };
        Insert: {
          author_id: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          note?: string | null;
          order_id: string;
          stage: string;
        };
        Update: {
          author_id?: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          note?: string | null;
          order_id?: string;
          stage?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_updates_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_updates_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "public_designer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_updates_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          budget: number | null;
          created_at: string;
          customer_id: string;
          deadline: string | null;
          designer_id: string | null;
          id: string;
          measurements: Json | null;
          notes: string | null;
          progress_percent: number;
          service_id: string | null;
          status: Database["public"]["Enums"]["order_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          budget?: number | null;
          created_at?: string;
          customer_id: string;
          deadline?: string | null;
          designer_id?: string | null;
          id?: string;
          measurements?: Json | null;
          notes?: string | null;
          progress_percent?: number;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["order_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          budget?: number | null;
          created_at?: string;
          customer_id?: string;
          deadline?: string | null;
          designer_id?: string | null;
          id?: string;
          measurements?: Json | null;
          notes?: string | null;
          progress_percent?: number;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["order_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "public_designer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_designer_id_fkey";
            columns: ["designer_id"];
            isOneToOne: false;
            referencedRelation: "designers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          base_price: number | null;
          category: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          slug: string;
          title: string;
        };
        Insert: {
          base_price?: number | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          slug: string;
          title: string;
        };
        Update: {
          base_price?: number | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      public_designer_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          full_name: string | null;
          id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          id?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "customer" | "designer" | "admin";
      appointment_status: "scheduled" | "confirmed" | "completed" | "cancelled";
      appointment_type: "consultation" | "fitting" | "delivery";
      custom_order_status:
        | "order_received"
        | "under_review"
        | "measurements_verified"
        | "design_consultation"
        | "price_quotation"
        | "awaiting_client_approval"
        | "payment_pending"
        | "payment_confirmed"
        | "production_started"
        | "fitting"
        | "adjustments_required"
        | "completed"
        | "ready_for_delivery"
        | "delivered"
        | "cancelled";
      custom_payment_status: "unpaid" | "deposit_paid" | "paid" | "refunded";
      order_status:
        "pending" | "accepted" | "in_progress" | "ready_for_fitting" | "completed" | "cancelled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "designer", "admin"],
      appointment_status: ["scheduled", "confirmed", "completed", "cancelled"],
      appointment_type: ["consultation", "fitting", "delivery"],
      custom_order_status: [
        "order_received",
        "under_review",
        "measurements_verified",
        "design_consultation",
        "price_quotation",
        "awaiting_client_approval",
        "payment_pending",
        "payment_confirmed",
        "production_started",
        "fitting",
        "adjustments_required",
        "completed",
        "ready_for_delivery",
        "delivered",
        "cancelled",
      ],
      custom_payment_status: ["unpaid", "deposit_paid", "paid", "refunded"],
      order_status: [
        "pending",
        "accepted",
        "in_progress",
        "ready_for_fitting",
        "completed",
        "cancelled",
      ],
    },
  },
} as const;
