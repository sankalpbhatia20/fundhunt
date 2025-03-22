import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1e40af',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  gridItem: {
    width: '50%',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    color: '#111827',
  },
  chart: {
    marginVertical: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
  },
});

const PDFReport = ({ client, portfolioData, stockRecommendations, charts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          src="/path/to/your/logo.png"
          style={styles.logo}
        />
        <Text>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.title}>Investment Portfolio Report</Text>
        <Text style={styles.subtitle}>Prepared for: {client.name}</Text>
      </View>

      {/* Portfolio Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portfolio Overview</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Risk Profile</Text>
            <Text style={styles.value}>{portfolioData.riskCategory}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Expected Return</Text>
            <Text style={styles.value}>{portfolioData.expectedReturn}%</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Portfolio Beta</Text>
            <Text style={styles.value}>{portfolioData.beta}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Portfolio Volatility</Text>
            <Text style={styles.value}>{portfolioData.volatility}%</Text>
          </View>
        </View>
        
        {/* Portfolio Allocation Chart */}
        <Image src={charts.allocation} style={styles.chart} />
      </View>

      {/* Stock Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Stocks</Text>
        {stockRecommendations.map((stock, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text style={styles.value}>{stock.name}</Text>
            <Text style={styles.label}>{stock.description}</Text>
            <Image src={stock.chart} style={styles.chart} />
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>© 2024 Your Company Name. All rights reserved.</Text>
        <Text>Contact: support@yourcompany.com | +1 (555) 123-4567</Text>
      </View>
    </Page>
  </Document>
);

export default PDFReport; 