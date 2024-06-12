import { FormattedMessage, useIntl, defineMessages } from 'react-intl';

import FlagIcon from '@/material-icons/400-24px/flag-fill.svg?react';
import { Icon } from 'mastodon/components/icon';
import { RelativeTimestamp } from 'mastodon/components/relative_timestamp';
import type { NotificationGroupAdminReport } from 'mastodon/models/notification_group';
import { useAppSelector } from 'mastodon/store';

import { NamesList } from './names_list';

// This needs to be kept in sync with app/models/report.rb
const messages = defineMessages({
  other: {
    id: 'report_notification.categories.other',
    defaultMessage: 'Other',
  },
  spam: { id: 'report_notification.categories.spam', defaultMessage: 'Spam' },
  legal: {
    id: 'report_notification.categories.legal',
    defaultMessage: 'Legal',
  },
  violation: {
    id: 'report_notification.categories.violation',
    defaultMessage: 'Rule violation',
  },
});

export const NotificationAdminReport: React.FC<{
  notification: NotificationGroupAdminReport;
}> = ({ notification, notification: { report } }) => {
  const intl = useIntl();
  const targetAccount = useAppSelector((state) =>
    state.getIn(['accounts', report.target_account.id]),
  );
  const account = useAppSelector((state) =>
    state.getIn(['accounts', notification.sampleAccountsIds[0]]),
  );
  const values = {
    name: (
      <bdi
        dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
      />
    ),
    target: (
      <bdi
        dangerouslySetInnerHTML={{
          __html: targetAccount.get('display_name_html'),
        }}
      />
    ),
    category: intl.formatMessage(messages[report.category]),
    count: report.status_ids.length,
  };

  let message;

  if (report.status_ids.length > 0) {
    if (report.category === 'other') {
      message = (
        <FormattedMessage
          id='notification.admin.report_account_other'
          defaultMessage='{name} reported {count, plural, one {one post} other {# posts}} from {target}'
          values={values}
        />
      );
    } else {
      message = (
        <FormattedMessage
          id='notification.admin.report_account'
          defaultMessage='{name} reported {count, plural, one {one post} other {# posts}} from {target} for {category}'
          values={values}
        />
      );
    }
  } else {
    if (report.category === 'other') {
      message = (
        <FormattedMessage
          id='notification.admin.report_statuses_other'
          defaultMessage='{name} reported {target}'
          values={values}
        />
      );
    } else {
      message = (
        <FormattedMessage
          id='notification.admin.report_statuses'
          defaultMessage='{name} reported {target} for {category}'
          values={values}
        />
      );
    }
  }

  return (
    <a
      href={`/admin/reports/${report.id}`}
      target='_blank'
      rel='noopener noreferrer'
      className='notification-group notification-group--link notification-group--admin-report focusable'
      tabIndex={0}
    >
      <div className='notification-group__icon'>
        <Icon id='flag' icon={FlagIcon} />
      </div>

      <div className='notification-group__main'>
        <div className='notification-group__main__header'>
          <div className='notification-group__main__header__label'>
            {message}
            <RelativeTimestamp timestamp={report.created_at} />
          </div>
        </div>

        {report.comment.length > 0 && (
          <div className='notification-group__embedded-status__content'>
            “{report.comment}”
          </div>
        )}
      </div>
    </a>
  );
};
