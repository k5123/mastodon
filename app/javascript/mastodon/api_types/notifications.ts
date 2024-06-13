// See app/serializers/rest/notification_group_serializer.rb

import type { AccountWarningAction } from 'mastodon/models/notification_group';

import type { ApiAccountJSON } from './accounts';
import type { ApiReportJSON } from './reports';
import type { ApiStatusJSON } from './statuses';

// See app/model/notification.rb
export type NotificationWithStatusType =
  | 'favourite'
  | 'reblog'
  | 'status'
  | 'mention'
  | 'poll'
  | 'update';

export type NotificationType =
  | NotificationWithStatusType
  | 'follow'
  | 'follow_request'
  | 'moderation_warning'
  | 'severed_relationships'
  | 'admin.sign_up'
  | 'admin.report';

export interface BaseNotificationGroupJSON {
  group_key: string;
  notifications_count: number;
  type: NotificationType;
  sample_accounts: ApiAccountJSON[];
  latest_page_notification_at: string; // FIXME: This will only be present if the notification group is returned in a paginated list, not requested directly
  page_min_id?: string;
  page_max_id?: string;
}

interface NotificationGroupWithStatusJSON extends BaseNotificationGroupJSON {
  type: NotificationWithStatusType;
  status: ApiStatusJSON;
}

interface ReportNotificationGroupJSON extends BaseNotificationGroupJSON {
  type: 'admin.report';
  report: ApiReportJSON;
}

interface SimpleNotificationGroupJSON extends BaseNotificationGroupJSON {
  type: 'follow' | 'follow_request' | 'admin.sign_up';
}

export interface ApiAccountWarningJSON {
  id: string;
  action: AccountWarningAction;
  text: string;
  status_ids: string[];
  created_at: string;
  target_account: ApiAccountJSON;
  appeal: unknown;
}

interface ModerationWarningNotificationGroupJSON
  extends BaseNotificationGroupJSON {
  type: 'moderation_warning';
  moderation_warning: ApiAccountWarningJSON;
}

export interface ApiAccountRelationshipSeveranceEventJSON {
  id: string;
  type: 'account_suspension' | 'domain_block' | 'user_domain_block';
  purged: boolean;
  target_name: string;
  followers_count: number;
  following_count: number;
  created_at: string;
}

interface AccountRelationshipSeveranceNotificationGroupJSON
  extends BaseNotificationGroupJSON {
  type: 'severed_relationships';
  event: ApiAccountRelationshipSeveranceEventJSON;
}

export type NotificationGroupJSON =
  | SimpleNotificationGroupJSON
  | ReportNotificationGroupJSON
  | AccountRelationshipSeveranceNotificationGroupJSON
  | NotificationGroupWithStatusJSON
  | ModerationWarningNotificationGroupJSON;