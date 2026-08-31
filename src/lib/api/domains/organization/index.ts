export { listOrganizations } from "./list-organizations";
export { listOrganizationMerchants } from "./list-organization-merchants";
export { listOrganizationMembers } from "./list-organization-members";
export { listOrganizationRoles } from "./list-organization-roles";
export {
    createOrganizationRole,
    updateOrganizationRole,
    deleteOrganizationRole,
} from "./organization-roles";
export { createOrganizationInvitation } from "./create-organization-invitation";
export {
    removeOrganizationMember,
    changeOrganizationMemberRole,
    acceptOrganizationInvitation,
} from "./organization-membership";
export { createOrganizationMerchant } from "./create-organization-merchant";
export { getOrganizationRoleScope } from "./get-organization-role-scope";
export { replaceOrganizationRoleScope } from "./replace-organization-role-scope";
export {
    listOrganizationTeams,
    createOrganizationTeam,
    updateOrganizationTeam,
    archiveOrganizationTeam,
    listOrganizationTeamMembers,
    addOrganizationTeamMember,
    removeOrganizationTeamMember,
} from "./organization-teams";
export type {
    OrganizationRoleType,
    OrganizationRoleKind,
    OrganizationPermission,
    OrganizationPermissionDomain,
    OrganizationRoleSummary,
    OrganizationRoleResponse,
    OrganizationMemberRole,
    MembershipStatus,
    OrganizationSummaryView,
    OrganizationMerchantView,
    OrganizationMerchantSettlementMode,
    OrganizationMerchantStatus,
    OrganizationMemberView,
    OrganizationRoleScopeResponse,
    OrganizationInvitationView,
    CreateOrganizationInvitationRequest,
    CreateOrganizationRoleRequest,
    UpdateOrganizationRoleRequest,
    ReplaceOrganizationRoleScopeRequest,
    CreateOrganizationMerchantRequest,
    TeamRole,
    TeamStatus,
    OrganizationTeamView,
    OrganizationTeamMemberView,
    CreateOrganizationTeamRequest,
    TeamHasLastOwnerData,
} from "./types";
export {
    ORGANIZATION_PERMISSIONS,
    ORGANIZATION_PERMISSION_DOMAINS,
    ORGANIZATION_PERMISSION_DOMAIN_ORDER,
} from "./types";

import { listOrganizations } from "./list-organizations";
import { listOrganizationMerchants } from "./list-organization-merchants";
import { listOrganizationMembers } from "./list-organization-members";
import { listOrganizationRoles } from "./list-organization-roles";
import {
    createOrganizationRole,
    updateOrganizationRole,
    deleteOrganizationRole,
} from "./organization-roles";
import { createOrganizationInvitation } from "./create-organization-invitation";
import {
    removeOrganizationMember,
    changeOrganizationMemberRole,
    acceptOrganizationInvitation,
} from "./organization-membership";
import { createOrganizationMerchant } from "./create-organization-merchant";
import { getOrganizationRoleScope } from "./get-organization-role-scope";
import { replaceOrganizationRoleScope } from "./replace-organization-role-scope";
import {
    listOrganizationTeams,
    createOrganizationTeam,
    updateOrganizationTeam,
    archiveOrganizationTeam,
    listOrganizationTeamMembers,
    addOrganizationTeamMember,
    removeOrganizationTeamMember,
} from "./organization-teams";

export const organizationApi = {
    list: listOrganizations,
    listMerchants: listOrganizationMerchants,
    listMembers: listOrganizationMembers,
    listRoles: listOrganizationRoles,
    createRole: createOrganizationRole,
    updateRole: updateOrganizationRole,
    deleteRole: deleteOrganizationRole,
    getRoleScope: getOrganizationRoleScope,
    replaceRoleScope: replaceOrganizationRoleScope,
    invite: createOrganizationInvitation,
    removeMember: removeOrganizationMember,
    changeMemberRole: changeOrganizationMemberRole,
    acceptInvitation: acceptOrganizationInvitation,
    createMerchant: createOrganizationMerchant,
    listTeams: listOrganizationTeams,
    createTeam: createOrganizationTeam,
    updateTeam: updateOrganizationTeam,
    archiveTeam: archiveOrganizationTeam,
    listTeamMembers: listOrganizationTeamMembers,
    addTeamMember: addOrganizationTeamMember,
    removeTeamMember: removeOrganizationTeamMember,
};
