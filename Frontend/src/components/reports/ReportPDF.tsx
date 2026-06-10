import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#475569',
  },
  value: {
    width: '60%',
    color: '#1e293b',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    width: '23%',
    padding: 10,
    borderRadius: 4,
    border: '1 solid #e2e8f0',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 9,
    padding: 4,
  },
});

interface ReportPDFProps {
  data: any;
}

export const ReportPDF = ({ data }: ReportPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reporte de Sesiones</Text>
        <Text style={styles.subtitle}>
          Período: {new Date(data.period.startDate).toLocaleDateString('es-ES')} - {new Date(data.period.endDate).toLocaleDateString('es-ES')}
        </Text>
      </View>

      {/* Resumen General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen General</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: '#dbeafe' }]}>
            <Text style={styles.statLabel}>Total Sesiones</Text>
            <Text style={[styles.statValue, { color: '#1e40af' }]}>{data.summary.totalSessions}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#dcfce7' }]}>
            <Text style={styles.statLabel}>Completadas</Text>
            <Text style={[styles.statValue, { color: '#15803d' }]}>{data.summary.completedSessions}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#fef3c7' }]}>
            <Text style={styles.statLabel}>Programadas</Text>
            <Text style={[styles.statValue, { color: '#a16207' }]}>{data.summary.scheduledSessions}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#fee2e2' }]}>
            <Text style={styles.statLabel}>Canceladas</Text>
            <Text style={[styles.statValue, { color: '#b91c1c' }]}>{data.summary.canceledSessions}</Text>
          </View>
        </View>
      </View>

      {/* Estadísticas de Notas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas Clínicas</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total de Notas:</Text>
          <Text style={styles.value}>{data.summary.totalNotes}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sesiones con Notas:</Text>
          <Text style={styles.value}>{data.summary.sessionsWithNotes}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Promedio por Sesión:</Text>
          <Text style={styles.value}>{data.summary.averageNotesPerSession}</Text>
        </View>
      </View>

      {/* Estadísticas por Terapeuta */}
      {data.therapistStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas por Terapeuta</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Terapeuta</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Total</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Completadas</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Programadas</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Canceladas</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>Notas</Text>
            </View>
            {data.therapistStats.map((therapist: any) => (
              <View key={therapist.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '30%' }]}>{therapist.name}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{therapist.totalSessions}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{therapist.completedSessions}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{therapist.scheduledSessions}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{therapist.canceledSessions}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{therapist.totalNotes}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Estadísticas por Paciente */}
      {data.patientStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas por Paciente</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Paciente</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Total</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Completadas</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Programadas</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Canceladas</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>Notas</Text>
            </View>
            {data.patientStats.slice(0, 10).map((patient: any) => (
              <View key={patient.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '30%' }]}>{patient.name}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{patient.totalSessions}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{patient.completedSessions}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{patient.scheduledSessions}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{patient.canceledSessions}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{patient.totalNotes}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);


export const downloadPDF = async (data: any, filename: string = 'reporte-sesiones.pdf') => {
  try {
    const blob = await pdf(<ReportPDF data={data} />).toBlob();
    const file = new File([blob], filename, { type: 'application/pdf' });
    const url = window.URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    throw error;
  }
};
