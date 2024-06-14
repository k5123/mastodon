import { createReducer } from '@reduxjs/toolkit';

import { fetchNotifications } from 'mastodon/actions/notification_groups';
import { createNotificationGroupFromJSON } from 'mastodon/models/notification_group';
import type { NotificationGroup } from 'mastodon/models/notification_group';

export interface NotificationGap {
  type: 'gap';
  loadUrl: string;
}

interface NotificationGroupsState {
  groups: (NotificationGroup | NotificationGap)[];
  unread: number;
  isLoading: boolean;
  hasMore: boolean;
  readMarkerId: string;
}

const initialState: NotificationGroupsState = {
  groups: [],
  unread: 0,
  isLoading: false,
  hasMore: false,
  readMarkerId: '0',
};

export const notificationGroupsReducer = createReducer<NotificationGroupsState>(
  initialState,
  (builder) => {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.groups = action.payload.map((json) =>
        json.type === 'gap' ? json : createNotificationGroupFromJSON(json),
      );
      state.isLoading = false;
    });

    builder.addCase(fetchNotifications.rejected, (state) => {
      state.isLoading = false;
    });
  },
);
