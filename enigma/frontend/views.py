from django.shortcuts import render

def index(request):
    return render(request, 'frontend/index.html')

def map(request):
    return render(request, 'frontend/map.html')

def admin_panel(request):
    return render(request, 'frontend/admin_panel.html')