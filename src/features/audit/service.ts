import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create an audit record
     * @param values - The audit values to create
     * @returns The created audit record
     */
    create: async (values: t.TAuditDtoCreate) => {
        const created = await repo.create(values);
        return created;
    },

    /**
     * Delete an audit record
     * @param id - The id of the audit record to delete
     * @returns void
     */
    delete: async (id: t.TAuditDto['id']) => {
        const current = await repo.getById(id);
        return repo.delete(id, current);
    },

    /**
     * Get an audit record by id
     * @param id - The id of the audit record to get
     * @returns The audit record
     */
    getById: async (id: t.TAuditDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List audit records
     * @param filters - The filters to apply to the audit records
     * @param pagination - The pagination to apply to the audit records
     * @returns The audit records
     */
    list: async (filters: t.TAuditDtoFilter, pagination?: TPagination) => {
        return repo.list(filters, pagination);
    },

    /**
     * List audit records by creator user
     * @param creator_user - The creator user to list audit records for
     * @param filters - The filters to apply to the audit records
     * @param pagination - The pagination to apply to the audit records
     * @returns The audit records
     */
    listByCreatorUser: async (
        creator_user: t.TAuditDtoFilter['creator_user'],
        filters?: t.TAuditDtoFilter,
        pagination?: TPagination
    ) => {
        filters.creator_user = creator_user;
        return await repo.list(filters, pagination);
    },

    /**
     * List audit records by entity
     * @param entity - The entity to list audit records for
     * @param entityId - The entity id to list audit records for
     * @param filters - The filters to apply to the audit records
     * @param pagination - The pagination to apply to the audit records
     * @returns The audit records
     */
    listByEntityId: async (
        entity: t.TAuditDtoFilter['entity'],
        entity_id: t.TAuditDtoFilter['entity_id'],
        filters?: t.TAuditDtoFilter,
        pagination?: TPagination
    ) => {
        filters.entity = entity;
        filters.entity_id = entity_id;
        return await repo.list(filters, pagination);
    },

    /**
     * List audit records by request id
     * @param request_id - The request id to list audit records for
     * @param filters - The filters to apply to the audit records
     * @param pagination - The pagination to apply to the audit records
     * @returns The audit records
     */
    listByRequestId: async (
        request_id: t.TAuditDtoFilter['request_id'],
        filters?: t.TAuditDtoFilter,
        pagination?: TPagination
    ) => {
        filters.request_id = request_id;
        return await repo.list(filters, pagination);
    },

    /**
     * Update an audit record
     * @param id - The id of the audit record to update
     * @param values - The audit values to update
     * @param existing - The existing audit record
     * @returns The updated audit record
     */
    update: async (id: t.TAuditDto['id'], values: t.TAuditDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        return updated;
    },
};

export { serv, serv as auditService };
export default serv;
