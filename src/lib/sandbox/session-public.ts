import type { SandboxSession, SandboxSessionPublicView } from "./types";

export function toPublicSession(session: SandboxSession): SandboxSessionPublicView {
    const {
        clientSecret: _clientSecret,
        accessToken: _accessToken,
        ...publicView
    } = session;
    void _clientSecret;
    void _accessToken;
    return publicView;
}
