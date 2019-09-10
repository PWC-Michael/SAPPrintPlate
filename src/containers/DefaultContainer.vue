<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="#">
        <img class="navbar-brand-full" src="img/sap-logo.jpg" style="width: 100%;" alt="SAP Logo">
        <img class="navbar-brand-minimized" src="img/favicon.png" width="30" height="30" alt="SAP Logo">
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" />
      <b-navbar-nav class="ml-auto">
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </AppSidebar>
      <main id="main-container" class="main">
        <div class="container-fluid mt-3">
          <router-view></router-view>
        </div>
      </main>
      <AppAside fixed>
        <!--aside-->
        <DefaultAside/>
      </AppAside>
    </div>
    <TheFooter>
      <!--footer-->
      <div class="ml-auto">
        <span class="mr-1">Plate Printing by </span>
        <a href="https://www.sandhurstautoprint.co.uk/">Sandhurst Autoprint</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import nav from '@/_nav'
import { Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav, Aside as AppAside, AsideToggler, Footer as TheFooter, Breadcrumb } from '@coreui/vue'
import DefaultAside from './DefaultAside'
import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'

export default {
  name: 'DefaultContainer',
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  },
  data () {
    return {
      nav: []
    }
  },
  created() {
    let userObj = JSON.parse(localStorage.getItem('user'));
    this.$data.nav = nav.items.filter((element) => {
      if (element.title) {
        return element;
      }
      else {
        return element.auth.indexOf(userObj.auth) > -1;
      }
    });

  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label )
    }
  }
}
</script>
