# Looker Studio Integration Setup Guide

This guide will help you set up Google Looker Studio (formerly Data Studio) integration with your Smart City Dashboard.

## Prerequisites

1. Google Cloud Platform account
2. Firebase project with Firestore database
3. Google API credentials

## Step 1: Enable Google APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable the following APIs:
   - **Data Studio API** (Looker Studio API)
   - **Firebase API**
   - **Firestore API**

## Step 2: Create API Credentials

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the API key
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:5173` (for Vite development)
   - Your production domain
7. Copy the Client ID

## Step 3: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration (you should already have these)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google API Configuration for Looker Studio
VITE_GOOGLE_API_KEY=
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_PROJECT_ID=your_google_project_id

# Looker Studio Configuration (optional - will be created automatically)
VITE_LOOKER_DATASET_ID=your_looker_dataset_id
VITE_LOOKER_REPORT_ID=your_looker_report_id
```

## Step 4: Set Up Firestore Data Source

1. Go to [Looker Studio](https://lookerstudio.google.com/)
2. Click **Create** > **Data Source**
3. Search for **Firebase Firestore**
4. Connect to your Firestore database
5. Select the collections you want to analyze:
   - `detections`
   - `alerts`
   - `cameras`
   - `detection_history`
   - `profiles`

## Step 5: Create Sample Dashboards

### Dashboard 1: Detection Analytics
- **Time Series Chart**: Detections over time
- **Pie Chart**: Detection types distribution
- **Bar Chart**: Detections by location
- **Gauge Chart**: Detection accuracy

### Dashboard 2: Alert Management
- **Bar Chart**: Alerts by severity
- **Time Series**: Alert frequency
- **Table**: Recent alerts
- **Geo Chart**: Alerts by location

### Dashboard 3: Camera Performance
- **Gauge Chart**: Camera uptime
- **Bar Chart**: Detections per camera
- **Line Chart**: Performance trends
- **Table**: Camera status

## Step 6: Configure Data Refresh

1. In Looker Studio, go to **File** > **Report Settings**
2. Set **Data refresh** to your preferred interval
3. Enable **Real-time data** if needed

## Step 7: Set Up Automated Reports

1. In Looker Studio, click **Schedule** > **Email delivery**
2. Configure:
   - **Recipients**: Email addresses
   - **Frequency**: Daily, weekly, or monthly
   - **Format**: PDF, CSV, or Excel
   - **Subject**: Custom subject line

## Step 8: Embed Dashboards

### Option 1: Direct Embedding
```html
<iframe 
  src="https://datastudio.google.com/embed/reporting/YOUR_REPORT_ID/page/YOUR_PAGE_ID"
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

### Option 2: Using the App
1. Navigate to **Analytics** in your Smart City Dashboard
2. Click **Create Dashboard**
3. The app will automatically create and embed dashboards

## Step 9: Advanced Features

### Real-time Data Updates
- Configure Firestore triggers to update dashboards
- Set up real-time listeners for live data

### Custom Metrics
- Create calculated fields in Looker Studio
- Set up custom aggregations
- Define business KPIs

### Data Export
- Schedule automated exports
- Set up data pipelines
- Configure backup procedures

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify API key is correct
   - Check API restrictions
   - Ensure APIs are enabled

2. **Authentication Issues**
   - Verify OAuth client ID
   - Check authorized origins
   - Clear browser cache

3. **Data Not Loading**
   - Check Firestore permissions
   - Verify collection names
   - Test data source connection

4. **Dashboard Not Embedding**
   - Check report sharing settings
   - Verify embed URL
   - Test in incognito mode

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API connections individually
4. Check network requests in DevTools

## Security Considerations

1. **API Key Security**
   - Restrict API key to specific domains
   - Use environment variables
   - Never commit keys to version control

2. **Data Access**
   - Set up proper Firestore security rules
   - Limit data access to necessary fields
   - Implement user authentication

3. **Dashboard Sharing**
   - Control who can view dashboards
   - Set up proper permissions
   - Monitor access logs

## Performance Optimization

1. **Data Queries**
   - Optimize Firestore queries
   - Use indexes for better performance
   - Limit data retrieval

2. **Dashboard Loading**
   - Use lazy loading for charts
   - Implement caching strategies
   - Optimize chart configurations

3. **Real-time Updates**
   - Use efficient listeners
   - Implement debouncing
   - Monitor resource usage

## Next Steps

1. **Custom Dashboards**: Create specialized dashboards for different user roles
2. **Advanced Analytics**: Implement machine learning insights
3. **Mobile Optimization**: Ensure dashboards work on mobile devices
4. **Integration**: Connect with other analytics tools
5. **Automation**: Set up automated alerts and reports

## Support Resources

- [Looker Studio Documentation](https://support.google.com/looker-studio/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google APIs Explorer](https://developers.google.com/apis-explorer/)

## Contact

For additional support or questions about this integration, please refer to the project documentation or create an issue in the repository. 