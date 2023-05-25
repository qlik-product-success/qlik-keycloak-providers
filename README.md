# Sample Keycloak Providers by Qlik

## Overview
This project contains sample providers for Keycloak which add functionality to that Identity Provider (IdP) for custom authentication scenarios that Qlik customers might find useful. These providers have been tested in Keycloak v21.0.1 but should work with v19.0.3 or above.

The following provider samples are currently included:
- [Qlik - Restrict Users by Domain](./src/qlik-keycloak-domain-auth.js)
- [Qlik - Append Email Domain to Groups](./src/qlik-keycloak-domain-mapper.js)

## Requirements
The following tools should be installed globally.
- Java Development Kit 11 - OpenJDK 11 LTS recommended. Higher versions should work but have not been tested.
- Apache Maven 3.9 - Required to build the providers JAR file and collect dependencies for the Nashorn JavaScript engine.
- ESLint 8.40 - Checks your Javascript for basic syntax errors. _(Optional)_
- Visual Studio Code with ESLint extension is recommended. _(Optional)_

## Packaging
The providers are packaged into a single JAR: `target\keycloak-server-copy\providers\qlik-keycloak-providers-<version>.jar`. The command to create this package is:
    mvn package

The `scripts` feature has dependencies that might not already be included in a given instance/deployment of Keycloak. The command to prepare these dependencies is:
    mvn dependency:copy-dependencies

## Deployment
Run the commands in the Packaging section as needed, then copy the files within the `target/keycloak-server-copy/providers` folder to the `keycloak/providers` folder on the target instance.

Run /opt/keycloak/bin/kc.sh build --features="scripts" and restart your Keycloak instance to enable the PoC providers.

## Configuring Keycloak
- _TODO: Add example of how to add `Qlik - Restrict Users by Domain` provider to a given authentication flow._
- _TODO: Add example of how to add `Qlik - Append Email Domain to Groups` provider to as a client claim mapper._

## License
This project is provided "AS IS", without any warranty, under the MIT License - see the [LICENSE](./LICENSE) file for details
