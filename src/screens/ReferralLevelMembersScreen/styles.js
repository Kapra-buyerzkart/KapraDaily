import { StyleSheet } from 'react-native';

const INK = '#1A1A1A';
const ORANGE = '#FF6A00';
const GRAY_50 = '#F5F4F0';
const GRAY_300 = '#D8D6CE';
const GRAY_500 = '#9A9A92';
const GRAY_600 = '#6B6B6B';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 13, color: GRAY_600 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_50,
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: INK },
  headerSub: { fontSize: 12, color: GRAY_600, marginTop: 2 },

  listContent: { paddingHorizontal: 16, gap: 10, flexGrow: 1 },

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GRAY_50,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  memberInfo: { flex: 1, minWidth: 0 },
  memberName: { fontSize: 14, fontWeight: '600', color: INK },
  memberSub: { fontSize: 12, color: GRAY_600, marginTop: 2 },
  memberRight: { alignItems: 'flex-end' },
  memberBt: { fontSize: 13, fontWeight: '700', color: ORANGE },
  memberBtLabel: { fontSize: 11, color: GRAY_500, marginTop: 2 },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyText: { fontSize: 13, color: GRAY_600, textAlign: 'center' },
  divider: { height: 1, backgroundColor: GRAY_300 },
});

export default styles;
