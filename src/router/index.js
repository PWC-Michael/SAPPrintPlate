import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const MainDesigner = () => import('@/views/MainDesigner')
const PlatePrintComponent = () => import('@/views/PlatePrintComponent')
const Dashboard = () => import('@/views/Dashboard')
const Groups = () => import('@/views/groups/Groups')
const Group = () => import('@/views/groups/Group')
const Area = () => import('@/views/areas/Area')
const Site = () => import('@/views/sites/Site')
const Jobs = () => import('@/views/jobs/Jobs')
const TradeCustomers = () => import('@/views/customers/TradeCustomers')
const RetailCustomers = () => import('@/views/customers/RetailCustomers')
const Contacts = () => import('@/views/contacts/Contacts')
const RegReport = () => import('@/views/reports/RegReport')
const Templates = () => import('@/views/templates/Templates')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Charts = () => import('@/views/Charts')
const Widgets = () => import('@/views/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')

// Views - Icons
const Flags = () => import('@/views/icons/Flags')
const FontAwesome = () => import('@/views/icons/FontAwesome')
const SimpleLineIcons = () => import('@/views/icons/SimpleLineIcons')
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

Vue.use(Router)

let router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/mainDesigner',
      name: 'MainDesigner',
      component: DefaultContainer,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'mainDesigner',
          name: 'MainDesigner',
          component: MainDesigner,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'mainDesigner/:tcsetup',
          name: 'MainDesigner',
          component: MainDesigner,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'groups',
          name: 'Groups',
          component: Groups,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'group',
          name: 'Group',
          component: Group,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'group/:groupshortname',
          name: 'Group',
          component: Group,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'group/:groupshortname/:areaname',
          name: 'Area',
          component: Area,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'group/:groupshortname/:areaname/:sitename',
          name: 'Site',
          component: Site,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'users',
          name: 'Users',
          component: Users,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'jobs',
          name: 'Jobs',
          component: Jobs,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'trade-customers',
          name: 'Trade Customers',
          component: TradeCustomers,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'templates',
          name: 'Templates',
          component: Templates,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'retail-customers',
          name: 'Retail Customers',
          component: RetailCustomers,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'contacts',
          name: 'Contacts',
          component: Contacts,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'regreport/:reg',
          name: 'Registration Report',
          component: RegReport,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'theme',
          redirect: '/theme/colors',
          name: 'Theme',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'colors',
              name: 'Colors',
              component: Colors
            },
            {
              path: 'typography',
              name: 'Typography',
              component: Typography
            }
          ]
        },
        {
          path: 'charts',
          name: 'Charts',
          component: Charts
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'users-old',
          meta: { label: 'Users'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Users,
            },
            {
              path: ':id',
              meta: { label: 'User Details'},
              name: 'User',
              component: User,
            },
          ]
        },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            }
          ]
        },
        {
          path: 'icons',
          redirect: '/icons/font-awesome',
          name: 'Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'CoreUI Icons',
              component: CoreUIIcons
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            },
            {
              path: 'font-awesome',
              name: 'Font Awesome',
              component: FontAwesome
            },
            {
              path: 'simple-line-icons',
              name: 'Simple Line Icons',
              component: SimpleLineIcons
            }
          ]
        },
        {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            }
          ]
        }
      ]
    },
    {
      path: '/plateprint',
      redirect: '/plateprint',
      name: 'PlatePrint',
      component: PlatePrintComponent
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404,
          meta: {
            guest: true
          }
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500,
          meta: {
            guest: true
          }
        },
        {
          path: 'login',
          name: 'Login',
          component: Login,
          meta: {
            guest: true
          }
        },
      ]
    }
  ]
});

// the router hook to manage what the user can see/navigate to

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('user') == null) {
          next({
              path: '/pages/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
          let user = JSON.parse(localStorage.getItem('user'))
          if(to.matched.some(record => record.meta.is_admin)) {
              if(user.is_admin == 1){
                  next()
              }
              else{
                  next({ name: 'userboard'})
              }
          }else {
              next()
          }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
          next({ name: 'userboard'})
      }
  }else {
      next() 
  }
})

export default router;
