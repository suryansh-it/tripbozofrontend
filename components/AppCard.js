import React from 'react';

const AppCard = ({ app }) => {
  const { name, icon, description, category, platform, appStoreUrl, playStoreUrl } = app;

  const getCategoryColor = (category) => {
    const colors = {
      transportation: 'bg-blue-100 text-blue-800',
      language: 'bg-purple-100 text-purple-800',
      food: 'bg-orange-100 text-orange-800',
      safety: 'bg-red-100 text-red-800',
      culture: 'bg-green-100 text-green-800',
      default: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.default;
  };

  const getPlatformBadge = (platform) => {
    switch (platform) {
      case 'ios':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
            </svg>
            iOS
          </span>
        );
      case 'android':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.61 15.15C16.15 15.15 15.77 14.78 15.77 14.32S16.15 13.5 16.61 13.5 17.45 13.86 17.45 14.32 17.07 15.15 16.61 15.15M7.41 15.15C6.95 15.15 6.57 14.78 6.57 14.32S6.95 13.5 7.41 13.5 8.24 13.86 8.24 14.32 7.87 15.15 7.41 15.15M16.91 10.14L18.58 7.26C18.67 7.09 18.61 6.88 18.45 6.79C18.28 6.69 18.07 6.75 17.97 6.91L16.29 9.83C14.95 9.22 13.5 8.9 12 8.91C10.47 8.91 9 9.24 7.73 9.82L6.05 6.91C5.95 6.75 5.74 6.69 5.57 6.79C5.4 6.88 5.35 7.09 5.44 7.26L7.1 10.13C4.15 11.79 2.17 14.8 2 18.26H22C21.82 14.81 19.85 11.8 16.91 10.14Z" />
            </svg>
            Android
          </span>
        );
      case 'both':
        return (
          <div className="flex space-x-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
              </svg>
              iOS
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.61 15.15C16.15 15.15 15.77 14.78 15.77 14.32S16.15 13.5 16.61 13.5 17.45 13.86 17.45 14.32 17.07 15.15 16.61 15.15M7.41 15.15C6.95 15.15 6.57 14.78 6.57 14.32S6.95 13.5 7.41 13.5 8.24 13.86 8.24 14.32 7.87 15.15 7.41 15.15M16.91 10.14L18.58 7.26C18.67 7.09 18.61 6.88 18.45 6.79C18.28 6.69 18.07 6.75 17.97 6.91L16.29 9.83C14.95 9.22 13.5 8.9 12 8.91C10.47 8.91 9 9.24 7.73 9.82L6.05 6.91C5.95 6.75 5.74 6.69 5.57 6.79C5.4 6.88 5.35 7.09 5.44 7.26L7.1 10.13C4.15 11.79 2.17 14.8 2 18.26H22C21.82 14.81 19.85 11.8 16.91 10.14Z" />
              </svg>
              Android
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* App Header */}
      <div className="p-4 flex items-center space-x-3 border-b border-gray-100">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {icon ? (
            <image src={icon} alt={`${name} icon`} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 leading-tight">{name}</h3>
          <div className="flex mt-1 items-center">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(category)}`}>
              {category}
            </span>
            <div className="ml-2">
              {getPlatformBadge(platform)}
            </div>
          </div>
        </div>
      </div>

      {/* App Description */}
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* App Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {appStoreUrl && (
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
            >
              App Store
            </a>
          )}
          {playStoreUrl && (
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
            >
              Play Store
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppCard; 