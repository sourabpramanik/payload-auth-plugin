import React from 'react';

import './index.scss';

const baseClass = 'after-dashboard';

const AfterDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <h4>This component was added by the plugin</h4>
      <h5>
        Find it here: <code>src/components/afterDashboard</code>
      </h5>
    </div>
  )
};

export default AfterDashboard;
