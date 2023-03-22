import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterView,
} from "vue-router";
import Login from "../views/auth/Login.vue";
import SecureVault from "../views/auth/SecureVault.vue";
import Dashboard from "../views/dashboard/index.vue";
import AddNetwork from "../views/network/AddNetwork.vue";
import CreateAccount from "../views/account/create/index.vue";
import NewAccount from "../views/account/create/NewAccount.vue";
import RecoverKeyPhrase from "../views/account/create/RecoverKeyPhrase.vue";
import ImportAccount from "../views/account/create/ImportAccount.vue";
import SendCoins from "../views/transactions/SendCoins.vue";
import SubmitTransaction from "../views/transactions/SubmitTransaction.vue";
import { RootState } from "../store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/secure",
    name: "secure",
    component: SecureVault,
  },
  {
    path: "/network",
    name: "Network",
    component: RouterView,
    children: [
      { path: "add", component: AddNetwork },
      {
        path: ":id",
        component: RouterView,
        children: [
          {
            path: "account/add",
            component: CreateAccount,
            children: [
              { path: "add", component: NewAccount },
              { path: "recover", component: RecoverKeyPhrase },
              { path: "import", component: ImportAccount },
            ],
          },
          {
            path: "account/:address",
            component: Dashboard,
            children: [
              { path: "send", component: SendCoins },
              { path: "submit-tx", component: SubmitTransaction },
            ],
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export const determineInitialRouteForState = (state: RootState) => {
  if (!state.user.passHash) {
    router.replace("/secure");
    return;
  }
  if (!state.user.password) {
    router.replace("/login");
    return;
  }
  const network = state.network;
  const allNetworks = network.networks;
  if (Object.keys(allNetworks).length === 0) {
    router.replace("/network/add");
    return;
  }
  const selectedNetworkId = network.selectedNetwork;
  const selectedNetwork = selectedNetworkId
    ? allNetworks[selectedNetworkId]
    : allNetworks[0];

  router.replace(`/network/${selectedNetwork.id}/account/xyz`);
};

export default router;
