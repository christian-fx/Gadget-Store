

// Orders Manager Class
class OrdersManager {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.initializePage();
  }
  
  initializeElements() {
    // Sidebar elements
    this.sidebar = document.getElementById('sidebar');
    this.openSidebarBtn = document.getElementById('openSidebar');
    this.closeSidebarBtn = document.getElementById('closeSidebar');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
  }
  
  bindEvents() {
    // Sidebar events
    this.openSidebarBtn?.addEventListener('click', () => this.openSidebar());
    this.closeSidebarBtn?.addEventListener('click', () => this.closeSidebar());
    this.sidebarOverlay?.addEventListener('click', () => this.closeSidebar());
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (event) => {
      const isClickInsideSidebar = this.sidebar?.contains(event.target);
      const isClickOnOpenBtn = this.openSidebarBtn?.contains(event.target);
      
      if (!isClickInsideSidebar && !isClickOnOpenBtn && !this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
        this.closeSidebar();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        this.sidebar?.classList.remove('-translate-x-full');
        this.sidebarOverlay?.classList.add('hidden');
      } else {
        if (!this.sidebar?.classList.contains('-translate-x-full')) {
          this.closeSidebar();
        }
      }
    });
    
    // Handle escape key for closing sidebar
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
        this.closeSidebar();
      }
    });
  }
  
  initializePage() {
    // Initialize any page-specific functionality
    console.log('Orders page initialized');
  }
  
  openSidebar() {
    this.sidebar?.classList.remove('-translate-x-full');
    this.sidebarOverlay?.classList.remove('hidden', 'opacity-0');
    this.sidebarOverlay?.classList.add('block', 'opacity-100');
    document.body.style.overflow = 'hidden';
  }
  
  closeSidebar() {
    this.sidebar?.classList.add('-translate-x-full');
    this.sidebarOverlay?.classList.remove('block', 'opacity-100');
    this.sidebarOverlay?.classList.add('hidden', 'opacity-0');
    document.body.style.overflow = '';
  }
}

// Initialize Orders Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const ordersManager = new OrdersManager();
});