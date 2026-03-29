import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

export function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [formData, setFormData] = useState({
    businessName: "",
    contactInfo: "",
    businessSector: "",
    warehouseLocation: "",
  });

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profile: UserProfile = {
      id: 0n,
      businessName: formData.businessName,
      contactInfo: formData.contactInfo,
      businessSector: formData.businessSector,
      warehouseLocation: formData.warehouseLocation,
      turnoverRegion: 0n,
      balanceShipping: 0,
      balanceGeneralGoods: 0,
      activeInvoices: [],
      shippingPackages: [],
    };

    await saveProfile.mutateAsync(profile);
  };

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Welcome! Set Up Your Business Profile</DialogTitle>
          <DialogDescription>
            Please provide your business information to get started with Agenda
            Automation Station.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              placeholder="Enter your business name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information *</Label>
            <Textarea
              id="contactInfo"
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              placeholder="Email, phone, address..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessSector">Business Sector *</Label>
            <Input
              id="businessSector"
              value={formData.businessSector}
              onChange={(e) =>
                setFormData({ ...formData, businessSector: e.target.value })
              }
              placeholder="e.g., Retail, Manufacturing, Services"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warehouseLocation">Primary Location</Label>
            <Input
              id="warehouseLocation"
              value={formData.warehouseLocation}
              onChange={(e) =>
                setFormData({ ...formData, warehouseLocation: e.target.value })
              }
              placeholder="City, State/Country"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
