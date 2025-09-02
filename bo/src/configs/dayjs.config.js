// dayjs.config.js
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

// Si vous avez besoin de relativeTime aussi
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr'

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default dayjs;
