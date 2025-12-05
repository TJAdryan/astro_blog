/* empty css                                 */
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, h as renderScript } from "../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { $ as $$BaseLayout } from "../chunks/BaseLayout__fXPCThu.mjs";
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { deriveState } from "@clerk/shared/deriveState";
import { eventMethodCalled } from "@clerk/shared/telemetry";
import { map, atom, batched, computed, onMount } from "nanostores";
import React, { useCallback, useSyncExternalStore } from "react";
import { createCheckAuthorization, resolveAuthState } from "@clerk/shared/authorization";
import { a as authAsyncStorage } from "../chunks/async-local-storage.server_DQ7sHqiS.mjs";
import { renderers } from "../renderers.mjs";
var $csrState = map({
  isLoaded: false,
  client: void 0,
  user: void 0,
  session: void 0,
  organization: void 0
});
var $initialState = map();
var $clerk = atom(null);
computed([$csrState], (state) => state.isLoaded);
var $authStore = batched([$csrState, $initialState], (state, initialState) => {
  return deriveState(
    state.isLoaded,
    {
      session: state.session,
      user: state.user,
      organization: state.organization,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      client: state.client
    },
    initialState
  );
});
computed([$authStore], (auth) => auth.user);
computed([$authStore], (auth) => auth.session);
var $organizationStore = computed([$authStore], (auth) => auth.organization);
var $clientStore = computed([$csrState], (csr) => csr.client);
computed([$clerk], (clerk) => clerk);
computed([$clientStore], (client) => client?.sessions);
var $signInStore = computed([$clientStore], (client) => client?.signIn);
var $signUpStore = computed([$clientStore], (client) => client?.signUp);
var recordTelemetryEvent = (store, method) => {
  onMount(store, () => {
    $clerk.get()?.telemetry?.record(eventMethodCalled(method));
  });
};
recordTelemetryEvent($signInStore, "$signInStore");
recordTelemetryEvent($signUpStore, "$signUpStore");
recordTelemetryEvent($organizationStore, "$organizationStore");
function useStore(store) {
  const get = store.get.bind(store);
  return React.useSyncExternalStore(store.listen, get, get);
}
var withClerk = (Component, displayName) => {
  displayName = displayName || Component.displayName || Component.name || "Component";
  Component.displayName = displayName;
  const HOC = (props) => {
    const clerk = useStore(
      computed([$csrState, $clerk], (state, clerk2) => {
        return state.isLoaded ? clerk2 : null;
      })
    );
    return /* @__PURE__ */ jsx(
      Component,
      {
        ...props,
        clerk
      },
      clerk ? "a" : "b"
    );
  };
  HOC.displayName = `withClerk(${displayName})`;
  return HOC;
};
var assertSingleChild = (children) => (name) => {
  try {
    return React.Children.only(children);
  } catch {
    return `You've passed multiple children components to <${name}/>. You can only pass a single child component or text.`;
  }
};
var normalizeWithDefaultValue = (children, defaultText) => {
  if (!children) {
    children = defaultText;
  }
  if (typeof children === "string") {
    children = /* @__PURE__ */ jsx("button", { type: "button", children });
  }
  return children;
};
var safeExecute = (cb) => (...args) => {
  if (cb && typeof cb === "function") {
    return cb(...args);
  }
};
withClerk(
  ({ clerk, children, ...props }) => {
    const {
      planId,
      planPeriod,
      for: _for,
      onSubscriptionComplete,
      newSubscriptionRedirectUrl,
      checkoutProps,
      ...rest
    } = props;
    children = normalizeWithDefaultValue(children, "Checkout");
    const child = assertSingleChild(children)("CheckoutButton");
    const clickHandler = () => {
      if (!clerk) {
        return;
      }
      return clerk.__internal_openCheckout({
        planId,
        planPeriod,
        for: _for,
        onSubscriptionComplete,
        newSubscriptionRedirectUrl,
        ...checkoutProps
      });
    };
    const wrappedChildClickHandler = (e) => {
      if (child && typeof child === "object" && "props" in child) {
        void safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "CheckoutButton"
);
withClerk(
  ({ clerk, children, ...props }) => {
    const { plan, planId, initialPlanPeriod, planDetailsProps, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Plan details");
    const child = assertSingleChild(children)("PlanDetailsButton");
    const clickHandler = () => {
      if (!clerk) {
        return;
      }
      return clerk.__internal_openPlanDetails({
        plan,
        planId,
        initialPlanPeriod,
        ...planDetailsProps
      });
    };
    const wrappedChildClickHandler = (e) => {
      if (child && typeof child === "object" && "props" in child) {
        void safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "PlanDetailsButton"
);
var SignInButton = withClerk(
  ({ clerk, children, ...props }) => {
    const { signUpFallbackRedirectUrl, forceRedirectUrl, fallbackRedirectUrl, signUpForceRedirectUrl, mode, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Sign in");
    const child = assertSingleChild(children)("SignInButton");
    const clickHandler = () => {
      const opts = {
        forceRedirectUrl,
        fallbackRedirectUrl,
        signUpFallbackRedirectUrl,
        signUpForceRedirectUrl
      };
      if (!clerk) {
        return;
      }
      if (mode === "modal") {
        return clerk.openSignIn({ ...opts, appearance: props.appearance });
      }
      return clerk.redirectToSignIn({
        ...opts,
        signInFallbackRedirectUrl: fallbackRedirectUrl,
        signInForceRedirectUrl: forceRedirectUrl
      });
    };
    const wrappedChildClickHandler = async (e) => {
      if (child && typeof child === "object" && "props" in child) {
        await safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "SignInButton"
);
withClerk(
  ({ clerk, children, ...props }) => {
    const { redirectUrl = "/", sessionId, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Sign out");
    const child = assertSingleChild(children)("SignOutButton");
    const clickHandler = () => clerk?.signOut({ redirectUrl, sessionId });
    const wrappedChildClickHandler = async (e) => {
      if (child && typeof child === "object" && "props" in child) {
        await safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "SignOutButton"
);
withClerk(
  ({ clerk, children, ...props }) => {
    const { fallbackRedirectUrl, forceRedirectUrl, signInFallbackRedirectUrl, signInForceRedirectUrl, mode, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Sign up");
    const child = assertSingleChild(children)("SignUpButton");
    const clickHandler = () => {
      const opts = {
        fallbackRedirectUrl,
        forceRedirectUrl,
        signInFallbackRedirectUrl,
        signInForceRedirectUrl
      };
      if (!clerk) {
        return;
      }
      if (mode === "modal") {
        return clerk.openSignUp({
          ...opts,
          appearance: props.appearance,
          unsafeMetadata: props.unsafeMetadata
        });
      }
      return clerk.redirectToSignUp({
        ...opts,
        signUpFallbackRedirectUrl: fallbackRedirectUrl,
        signUpForceRedirectUrl: forceRedirectUrl
      });
    };
    const wrappedChildClickHandler = async (e) => {
      if (child && typeof child === "object" && "props" in child) {
        await safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "SignUpButton"
);
withClerk(
  ({
    clerk,
    children,
    ...props
  }) => {
    const { for: _for, subscriptionDetailsProps, onSubscriptionCancel, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Subscription details");
    const child = assertSingleChild(children)("SubscriptionDetailsButton");
    const clickHandler = () => {
      if (!clerk) {
        return;
      }
      return clerk.__internal_openSubscriptionDetails({
        for: _for,
        onSubscriptionCancel,
        ...subscriptionDetailsProps
      });
    };
    const wrappedChildClickHandler = (e) => {
      if (child && typeof child === "object" && "props" in child) {
        void safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "SubscriptionDetailsButton"
);
var isMountProps = (props) => {
  return "mount" in props;
};
var isOpenProps = (props) => {
  return "open" in props;
};
var Portal = class extends React.PureComponent {
  portalRef = React.createRef();
  componentDidUpdate(prevProps) {
    if (!isMountProps(prevProps) || !isMountProps(this.props)) {
      return;
    }
    if (prevProps.props.appearance !== this.props.props.appearance || prevProps.props?.customPages?.length !== this.props.props?.customPages?.length) {
      this.props.updateProps?.({
        node: this.portalRef.current,
        props: this.props.props
      });
    }
  }
  componentDidMount() {
    if (this.portalRef.current) {
      if (isMountProps(this.props)) {
        this.props.mount?.(this.portalRef.current, this.props.props);
      }
      if (isOpenProps(this.props)) {
        this.props.open?.(this.props.props);
      }
    }
  }
  componentWillUnmount() {
    if (this.portalRef.current) {
      if (isMountProps(this.props)) {
        this.props.unmount?.(this.portalRef.current);
      }
      if (isOpenProps(this.props)) {
        this.props.close?.();
      }
    }
  }
  render() {
    return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { ref: this.portalRef }) });
  }
};
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountSignIn,
      unmount: clerk?.unmountSignIn,
      updateProps: clerk?.__unstable__updateProps,
      props
    }
  );
}, "SignIn");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountSignUp,
      unmount: clerk?.unmountSignUp,
      updateProps: clerk?.__unstable__updateProps,
      props
    }
  );
}, "SignUp");
var UserButton = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountUserButton,
      unmount: clerk?.unmountUserButton,
      updateProps: clerk?.__unstable__updateProps,
      props
    }
  );
}, "UserButton");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountUserProfile,
      unmount: clerk?.unmountUserProfile,
      updateProps: clerk?.__unstable__updateProps,
      props
    }
  );
}, "UserProfile");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountOrganizationProfile,
      unmount: clerk?.unmountOrganizationProfile,
      updateProps: clerk?.__unstable__updateProps,
      props
    }
  );
}, "OrganizationProfile");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountOrganizationSwitcher,
      unmount: clerk?.unmountOrganizationSwitcher,
      updateProps: clerk?.__unstable__updateProps,
      props
    }
  );
}, "OrganizationSwitcher");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountOrganizationList,
      unmount: clerk?.unmountOrganizationList,
      updateProps: clerk?.__unstable__updateProps,
      props
    }
  );
}, "OrganizationList");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      open: clerk?.openGoogleOneTap,
      close: clerk?.closeGoogleOneTap,
      props
    }
  );
}, "GoogleOneTap");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountWaitlist,
      unmount: clerk?.unmountWaitlist,
      props
    }
  );
}, "Waitlist");
withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ jsx(
    Portal,
    {
      mount: clerk?.mountPricingTable,
      unmount: clerk?.unmountPricingTable,
      props
    }
  );
}, "PricingTable");
var clerkLoaded = () => {
  return new Promise((resolve) => {
    $csrState.subscribe(({ isLoaded }) => {
      if (isLoaded) {
        resolve($clerk.get());
      }
    });
  });
};
var createGetToken = () => {
  return async (options) => {
    const clerk = await clerkLoaded();
    if (!clerk.session) {
      return null;
    }
    return clerk.session.getToken(options);
  };
};
var createSignOut = () => {
  return async (...args) => {
    const clerk = await clerkLoaded();
    return clerk.signOut(...args);
  };
};
var useAuth = ({ treatPendingAsSignedOut } = {}) => {
  const authContext = useAuthStore();
  const getToken = useCallback(createGetToken(), []);
  const signOut = useCallback(createSignOut(), []);
  const { userId, orgId, orgRole, orgPermissions, factorVerificationAge, sessionClaims } = authContext;
  const has = useCallback(
    (params) => {
      return createCheckAuthorization({
        userId,
        orgId,
        orgRole,
        orgPermissions,
        factorVerificationAge,
        features: sessionClaims?.fea || "",
        plans: sessionClaims?.pla || ""
      })(params);
    },
    [userId, orgId, orgRole, orgPermissions, factorVerificationAge, sessionClaims]
  );
  const payload = resolveAuthState({
    authObject: {
      ...authContext,
      getToken,
      signOut,
      has
    },
    options: {
      treatPendingAsSignedOut
    }
  });
  if (!payload) {
    throw new Error("Invalid state. Feel free to submit a bug or reach out to support");
  }
  return payload;
};
function useStore2(store, getServerSnapshot) {
  const get = store.get.bind(store);
  return useSyncExternalStore(store.listen, get, getServerSnapshot || get);
}
function useAuthStore() {
  const get = $authStore.get.bind($authStore);
  return useStore2($authStore, () => {
    if (typeof window === "undefined") {
      return deriveState(
        false,
        {
          user: null,
          session: null,
          client: null,
          organization: null
        },
        authAsyncStorage.getStore()
      );
    }
    return get();
  });
}
function SignedOut({ children, treatPendingAsSignedOut }) {
  const { userId } = useAuth({ treatPendingAsSignedOut });
  if (userId) {
    return null;
  }
  return children;
}
function SignedIn({ children, treatPendingAsSignedOut }) {
  const { userId } = useAuth({ treatPendingAsSignedOut });
  if (!userId) {
    return null;
  }
  return children;
}
computed($csrState, (state) => state.isLoaded);
withClerk(
  ({ clerk, ...handleRedirectCallbackParams }) => {
    React.useEffect(() => {
      void clerk?.handleRedirectCallback(handleRedirectCallbackParams);
    }, []);
    return null;
  },
  "AuthenticateWithRedirectCallback"
);
function LoginButton() {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsx(SignedOut, { children: /* @__PURE__ */ jsx(SignInButton, { mode: "modal", children: /* @__PURE__ */ jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors", children: "Sign In" }) }) }),
    /* @__PURE__ */ jsx(SignedIn, { children: /* @__PURE__ */ jsx(UserButton, {}) })
  ] });
}
const $$Private = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div className="max-w-4xl mx-auto p-6"> <div className="flex justify-between items-center mb-8"> <h1 className="text-3xl font-bold">Private Dashboard</h1> ${renderComponent($$result2, "LoginButton", LoginButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/dominickryan/astro_blog/astro_blog/src/components/LoginButton.jsx", "client:component-export": "default" })} </div> ${renderComponent($$result2, "SignedIn", SignedIn, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@clerk/astro/react", "client:component-export": "SignedIn" }, { "default": ($$result3) => renderTemplate` <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8"> <h2 className="text-xl font-semibold mb-4">Welcome back!</h2> <p className="text-gray-700 mb-4">
This content is only visible because you are logged in.
</p> <div className="bg-blue-50 p-4 rounded text-blue-800">
You have successfully authenticated with Clerk.
</div> </div> <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200"> <h2 className="text-2xl font-bold mb-6">Weekly Reading Challenge</h2>  <div id="reading-challenge-root"></div> ${renderScript($$result3, "/Users/dominickryan/astro_blog/astro_blog/src/pages/private.astro?astro&type=script&index=0&lang.ts")} </div> ` })} ${renderComponent($$result2, "SignedOut", SignedOut, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@clerk/astro/react", "client:component-export": "SignedOut" }, { "default": ($$result3) => renderTemplate` <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center"> <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Denied</h2> <p className="text-yellow-700 mb-4">You must be logged in to view this page.</p> <a href="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
Go to Login
</a> </div> ` })} </div> ` })}`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/private.astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/private.astro";
const $$url = "/private";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Private,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
