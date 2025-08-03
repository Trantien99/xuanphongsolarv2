import { useState } from "react";
import { X, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

interface ConsultationFormData {
  category: string;
  name: string;
  phone: string;
  email: string;
  content: string;
}

const consultationCategories = [
  { value: "solar-panels", label: t('consultationCategories.solar-panels') },
  { value: "inverters", label: t('consultationCategories.inverters') },
  { value: "batteries", label: t('consultationCategories.batteries') },
  { value: "installation", label: t('consultationCategories.installation') },
  { value: "maintenance", label: t('consultationCategories.maintenance') },
  { value: "financing", label: t('consultationCategories.financing') },
  { value: "others", label: t('consultationCategories.others') },
];

export function ConsultationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ConsultationFormData>({
    category: "",
    name: "",
    phone: "",
    email: "",
    content: "",
  });

  const handleInputChange = (field: keyof ConsultationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.category) {
      toast({
        title: t('error'),
        description: t('validation.selectCategory'),
        variant: "destructive",
      });
      return false;
    }

    if (!formData.name.trim()) {
      toast({
        title: t('error'),
        description: t('validation.enterName'),
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: t('error'),
        description: t('validation.enterPhone'),
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: t('error'),
        description: t('validation.phone'),
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: t('error'),
        description: t('validation.enterEmail'),
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t('error'),
        description: t('validation.email'),
        variant: "destructive",
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        title: t('error'),
        description: t('validation.enterContent'),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Không thể gửi yêu cầu tư vấn");
      }

      toast({
        title: t('success'),
        description: t('consultationSuccess'),
      });

      // Reset form
      setFormData({
        category: "",
        name: "",
        phone: "",
        email: "",
        content: "",
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('consultationError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 md:h-auto md:w-auto md:rounded-md md:px-4 md:py-2 pulse-subtle">
          <MessageCircle className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">{t('consultationButton')}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {t('consultationTitle')}
          </DialogTitle>
          <p className="text-sm text-gray-600 text-center">
            {t('consultationSubtitle')}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">{t('consultationCategory')} *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục..." />
              </SelectTrigger>
              <SelectContent>
                {consultationCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t('consultationName')} *</Label>
            <Input
              id="name"
              placeholder={t('consultationName')}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('consultationPhone')} *</Label>
            <Input
              id="phone"
              placeholder={t('consultationPhone')}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('consultationEmail')} *</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('consultationEmail')}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t('consultationContent')} *</Label>
            <Textarea
              id="content"
              placeholder={t('consultationPlaceholder')}
              rows={4}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('sending')}
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t('sendRequest')}
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center pt-2">
          {t('privacyText')}{" "}
          <span className="text-primary cursor-pointer hover:underline">
            {t('privacyPolicy')}
          </span>{" "}
          của chúng tôi
        </div>
      </DialogContent>
    </Dialog>
  );
}