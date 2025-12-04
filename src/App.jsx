import React from 'react';
import BusinessSustainabilityAssessment from './BusinessSustainabilityAssessment';
import { CompanyProvider, DataManagementProvider, UIProvider } from './contexts';

/**
 * App 根組件
 * 整合所有 Context Providers
 */
function App() {
  return (
    <UIProvider>
      <CompanyProvider>
        <DataManagementProvider>
          <BusinessSustainabilityAssessment />
        </DataManagementProvider>
      </CompanyProvider>
    </UIProvider>
  );
}

export default App;