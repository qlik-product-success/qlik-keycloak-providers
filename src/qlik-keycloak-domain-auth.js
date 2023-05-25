AuthenticationFlowError = Java.type("org.keycloak.authentication.AuthenticationFlowError");
JavaStringArray = Java.type("java.lang.String[]");

try {
    Response = Java.type("javax.ws.rs.core.Response");
} catch (e) {
    Response = Java.type("jakarta.ws.rs.core.Response");
}

ALLOW_DOMAIN_PREFIX = "allow-domain:";

function getAllowedDomains(client) {
    var ALLOWED_DOMAIN_MAX_COUNT = 50;
    var allowedDomainRoles = client.getRolesStream();
    return (
        allowedDomainRoles
            ? Java.from(
                allowedDomainRoles
                    .filter(function (roleModel) {
                        LOG.debug("Found '" + roleModel.getName() + "' role for client '" + client.getName() + "'");
                        return (
                            roleModel
                                .getName()
                                .toLowerCase()
                                .trim()
                                .indexOf(ALLOW_DOMAIN_PREFIX) == 0
                        );
                    })
                    .map(function (roleModel) {
                        var domain = roleModel
                            .getName()
                            .toLowerCase()
                            .replace(ALLOW_DOMAIN_PREFIX, "")
                            .trim();

                        LOG.debug("Adding domain '" + domain + "' to allowed list for client '" + client.getName() + "'");

                        return domain;
                    })
                    .toArray(function (count) { 
                        LOG.debug("Found " + count + " '" + ALLOW_DOMAIN_PREFIX + "' roles for client '" + client.getName() + "'");

                        return (new JavaStringArray(count));
                    })
                )
            : []
            );
}

function errorResponse(context, status, message) {
    return context.form()
            .setError(message, [])
            .createErrorPage(status);
}

function authenticate(context) {
    var email = user.getEmail() || "";
    var domain = email.split("@")[1].toLowerCase().trim() || "";
    var client = session.getContext().getClient();
    var allowedDomains = getAllowedDomains(client);

    LOG.debug("Allowed domains for client '" + client.getName() + "': " + allowedDomains.join(", "));

    if (allowedDomains.indexOf(domain) > -1) {
        LOG.info("Successful authentication for user '" + email + "' with domain '" + domain + "' for client '" + client.getName() + "'");
        return context.success();
    }

    if (allowedDomains.length == 0) {
        return context.failure(
            AuthenticationFlowError.CLIENT_DISABLED,
            errorResponse(
                context, 
                Response.Status.EXPECTATION_FAILED, 
                "No allowed domains have been configured. Logons are currently disabled by default."
            )
        );
    }

    LOG.info("Denied authentication for user '" + email + "' with domain '" + domain + "' for client '" + client.getName() + "'");

    return context.failure(
        AuthenticationFlowError.ACCESS_DENIED,
        errorResponse(
            context, 
            Response.Status.UNAUTHORIZED, 
            "You are not authorized to access this application."
        )
    );
}
