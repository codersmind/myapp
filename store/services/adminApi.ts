import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type RoleData = {
  id: string;
  slug: string;
  name: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  roles: RoleData[];
  isActive: boolean;
  mustResetPassword: boolean;
  createdAt: string;
  idsNo?: string;
};

export type UsersListResponse = {
  data: UserData[];
  totalCount: number;
};

export type ResetUserPasswordResult = {
  name: string;
  email: string;
  tempPassword: string;
  mustResetPassword?: boolean;
};

export type RoleApplicationData = {
  id: number;
  requestType: "handler" | "facility_owner" | "judge";
  username: string | null;
  email: string;
  name: string;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  payloadJson: string | null;
  status: "pending" | "approved" | "rejected";
  sourceTable: string | null;
  sourceIdsno: number | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type RoleApplicationsResponse = {
  data: RoleApplicationData[];
  pagination?: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin",
    credentials: "include",
  }),
  tagTypes: ["User", "Role", "RoleApplication"],
  endpoints: (builder) => ({
    getUsers: builder.query<
      UsersListResponse,
      Record<string, string | number | undefined>
    >({
      query: (params) => ({
        url: "users",
        params,
      }),
      providesTags: ["User"],
    }),
    getRoles: builder.query<RoleData[], void>({
      query: () => ({ url: "roles" }),
      transformResponse: (r: { success?: boolean; data?: RoleData[] } | RoleData[]) => {
        if (Array.isArray(r)) return r;
        return r?.data ?? [];
      },
      providesTags: ["Role"],
    }),
    createUser: builder.mutation<
      {
        success: boolean;
        emailSent: boolean;
        temporaryPassword?: string;
        user: { username: string; email: string };
      },
      { name: string; email: string; roleIds: string[] }
    >({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<
      { success: boolean },
      {
        id: string;
        name?: string;
        email?: string;
        roleIds?: string[];
        isActive?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `users/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `users/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    resetUserPassword: builder.mutation<ResetUserPasswordResult, string>({
      query: (id) => ({
        url: `users/${encodeURIComponent(id)}/reset-password`,
        method: "POST",
      }),
      transformResponse: (r: ResetUserPasswordResult & { success?: boolean }) => ({
        name: r.name,
        email: r.email,
        tempPassword: r.tempPassword,
        mustResetPassword: r.mustResetPassword,
      }),
      invalidatesTags: ["User"],
    }),
    getRoleApplications: builder.query<
      RoleApplicationsResponse,
      {
        status?: "pending" | "approved" | "rejected";
        offset?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "role-applications",
        params: params ?? undefined,
      }),
      transformResponse: (r: {
        success?: boolean;
        data?: RoleApplicationData[];
        pagination?: RoleApplicationsResponse["pagination"];
      }) => ({
        data: r?.data ?? [],
        pagination: r?.pagination,
      }),
      providesTags: ["RoleApplication"],
    }),
    reviewRoleApplication: builder.mutation<
      {
        success: boolean;
        accountCreated?: boolean;
        username?: string;
        email?: string;
        temporaryPassword?: string;
      },
      { id: number; action: "approve" | "reject" }
    >({
      query: ({ id, action }) => ({
        url: `role-applications/${id}`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["RoleApplication", "User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetRolesQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
  useGetRoleApplicationsQuery,
  useReviewRoleApplicationMutation,
} = adminApi;
