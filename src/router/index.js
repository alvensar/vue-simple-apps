import { createRouter, createWebHistory } from "vue-router"
import EventList from "../views/EventList.vue"
import EventService from '@/services/EventService.js'
import EventDetails from "@/views/event/Details.vue"
import EventLayout from "@/views/event/Layout.vue"
import EventRegister from '@/views/event/Register.vue'
import EventEdit from '@/views/event/Edit.vue'
import About from "../views/About.vue"
import NotFound from '@/views/event/NotFound.vue'
import NetworkError from '@/views/event/NetworkError.vue'
import NProgress from 'nprogress'
import GStore from '@/store'

const routes = [
  {
    path: "/",
    name: "EventList",
    props: route => ({ page: parseInt(route.query.page) || 1 }),
    component: EventList,
  },
  {
    path: '/events/:id',
    name: 'EventLayout',
    component: EventLayout,  // <-- We removed the props: true.
    beforeEnter: to => {
      return EventService.getEvent(to.params.id)
        .then(response => {
          GStore.event = response.data // <--- Store the event
        })
        .catch(error => {
          if (error.response && error.response.status == 404) {
            return {
              name: '404Resource',
              params: { resource: 'event' }
            }
          } else {
            return { name: 'NetworkError' }
          }
        })
    },
    children: [
      {
        path: '',
        name: 'EventDetails',
        component: EventDetails
      },
      {
        path: 'register',
        name: 'EventRegister',
        component: EventRegister
      },
      {
        path: 'edit',
        name: 'EventEdit',
        component: EventEdit
      }
    ]
  },
  //redirects when url changed or updated
  {
    path: '/event/:afterEvent(.*)',
    redirect: to => {
      return { path: '/events/' + to.params.afterEvent }
    }
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/404/:resource',
    name: '404Resource',
    component: NotFound,
    props: true
  },
  {
    path: '/network-error',
    name: 'NetworkError',
    component: NetworkError
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router;
