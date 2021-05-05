export const netlify_events_meta = {
  "deploy-building": {
    doc: "Triggered when Netlify starts building a site for deployment.",
    id: "deploy-building",
  },
  "deploy-succeeded": {
    doc: "Triggered when Netlify finishes deploying a site.",
    id: "deploy-succeeded",
  },
  "deploy-failed": {
    doc: "Triggered when a deploy does not complete.",
    id: "deploy-failed",
  },
  "deploy-locked": {
    doc:
      "Triggered when a deploy is locked in production and Netlify stops autopublishing deploys.",
    id: "deploy-locked",
  },
  "deploy-unlocked": {
    doc:
      "Triggered when a deploy is unlocked from production and Netlify resumes autopublishing deploys.",
    id: "deploy-unlocked",
  },
  "split-test-activated": {
    doc: "Triggered when a split test is activated.",
    id: "split-test-activated",
  },
  "split-test-deactivated": {
    doc: "Triggered when a split test is deactivated.",
    id: "split-test-deactivated",
  },
  "split-test-modified": {
    doc: "Triggered when a split test’s settings change.",
    id: "split-test-modified",
  },
  "submission-created": {
    doc: "Triggered when a form submission is verified for your site.",
    id: "submission-created",
  },
  "identity-validate": {
    doc: "Triggered when an Identity user tries to sign up via Identity.",
    id: "identity-validate",
  },
  "identity-signup": {
    doc:
      "Triggered when an Identity user signs up via Netlify Identity and confirms their email address. Note that this fires for email+password signups only, not for signups via external providers such as Google or GitHub.",
    id: "identity-signup",
  },
  "identity-login": {
    doc: "Triggered when an Identity user logs in via Netlify Identity.",
    id: "identity-login",
  },
} as const

// https://docs.netlify.com/functions/trigger-on-events/
const rawEventStrings = `
deploy-building: Triggered when Netlify starts building a site for deployment.
deploy-succeeded: Triggered when Netlify finishes deploying a site.
deploy-failed: Triggered when a deploy does not complete.
deploy-locked: Triggered when a deploy is locked in production and Netlify stops autopublishing deploys.
deploy-unlocked: Triggered when a deploy is unlocked from production and Netlify resumes autopublishing deploys.
split-test-activated: Triggered when a split test is activated.
split-test-deactivated: Triggered when a split test is deactivated.
split-test-modified: Triggered when a split test’s settings change.
submission-created: Triggered when a form submission is verified for your site.
identity-validate: Triggered when an Identity user tries to sign up via Identity.
identity-signup: Triggered when an Identity user signs up via Netlify Identity and confirms their email address. Note that this fires for email+password signups only, not for signups via external providers such as Google or GitHub.
identity-login: Triggered when an Identity user logs in via Netlify Identity.
`

function eventTypeItems() {
  return rawEventStrings
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .map((x) => {
      const [label, description] = x.split(":")
      return {
        label: `$(zap) ${label}`,
        value: label,
        detail: description.trim(),
      }
    })
}
