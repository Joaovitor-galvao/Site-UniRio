# Content app proxy - allows Django to find the content app at the top level
from .models import ContentBlock
from .views import ContentPageView

__all__ = ['ContentBlock', 'ContentPageView']