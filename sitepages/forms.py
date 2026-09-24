from django import forms
from .models import SitePage, PageElement


class ColorInput(forms.TextInput):
    input_type = "color"


class SitePageAdminForm(forms.ModelForm):
    class Meta:
        model = SitePage
        fields = "__all__"
        widgets = {
            "background_color": ColorInput(),
            "surface_color": ColorInput(),
            "text_color": ColorInput(),
            "primary_color": ColorInput(),
            "secondary_color": ColorInput(),
            "dark_color": ColorInput(),
            "light_color": ColorInput(),
            "custom_css": forms.Textarea(attrs={"rows": 8, "style": "font-family:monospace"}),
        }


class PageElementInlineForm(forms.ModelForm):
    class Meta:
        model = PageElement
        fields = "__all__"
        widgets = {
            "value": forms.Textarea(attrs={"rows": 3}),
        }
