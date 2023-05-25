// Available variables:
// 'user' - Current user.
// 'realm' - Current realm.
// 'token' - Current token.
// 'userSession' - Current userSession.
// 'keycloakSession' - Current keycloakSession.
AccessToken = Java.type("org.keycloak.representations.AccessToken");
IDToken = Java.type("org.keycloak.representations.IDToken");
JSON2 = Java.type("org.keycloak.util.JsonSerialization");

var email = user.getEmail() || "";
var domain = email.split("@")[1] || "";
var groups = [];

try {
  if (token instanceof AccessToken) {
    print("Found ID token.");
  } else if (token instanceof IDToken) {
    print("Found Access token.");
  }

  if (token) {
    var claimsAsJSON = JSON2.writeValueAsPrettyString(token.getOtherClaims());
    print("Claims: " + claimsAsJSON);
    var claims = JSON.parse(claimsAsJSON);
    groups = claims.groups || [];
  }
} catch (e) {
  print("Encountered error while inspecting token." + e.toString());
}

// Append the domain to the list of groups as a claim value
if (domain) {
  print("Adding 'domain:" + domain + "' as claim value to list.");
  groups.push("domain:" + domain);
}

// Delimit the combined groups list with "##" so Keycloak treats them as separate values
Java.to(groups)
