
// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

// Third Party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { formatAmount } from '@/utils/formatAmount'

const EarningReports = ({ earn }) => {
  const data = [
    {
      title: 'Revenue',
      progress: 64,
      stats: formatAmount(earn?.total || 0)+" F CFA",
      progressColor: 'primary',
      avatarColor: 'primary',
      avatarIcon: 'tabler-currency-dollar'
    },
    {
      title: 'Disponible au Retrait',
      progress: 59,
      stats: formatAmount(earn?.totalWithdrawable || 0)+" F CFA",
      progressColor: 'info',
      avatarColor: 'info',
      avatarIcon: 'tabler-chart-pie-2'
    },
    // {
    //   title: 'Montant en demande',
    //   progress: 59,
    //   stats: formatAmount(earn?.withdrawalAmountInPending || 0)+" F CFA",
    //   progressColor: 'info',
    //   avatarColor: 'info',
    //   avatarIcon: 'tabler-chart-pie-2'
    // },
    {
      title: 'Montant retiré',
      progress: 59,
      stats: formatAmount(earn?.totalWithdrawn || 0)+" F CFA",
      progressColor: 'info',
      avatarColor: 'info',
      avatarIcon: 'tabler-chart-pie-2'
    },
    /* {
      title: 'Dépense',
      progress: 22,
      stats: '$74.19',
      progressColor: 'error',
      avatarColor: 'error',
      avatarIcon: 'tabler-brand-paypal'
    } */
  ]

  return (
    <Card className='sm:h-[230px]'>
      <CardHeader
        title='Rapports sur les revenus'
        subheader=''
        // action={<OptionMenu options={['Last Week', 'Last Month', 'Last Year']} />}
        className='pbe-5'
      />
      <CardContent className='flex flex-col gap-5 max-md:gap-5 max-[1015px]:gap-[62px] max-[1051px]:gap-10 max-[1200px]:gap-5 max-[1310px]:gap-10'>
        {/* <div className='flex flex-col sm:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col gap-3 is-full sm:is-[unset]'>
            <div className='flex items-center gap-2.5'>
              <Typography variant='h2'>$468</Typography>
              <Chip size='small' variant='tonal' color='success' label='+4.2%' />
            </div>
            <Typography variant='body2' className='text-balance'>
              You informed of this week compared to last week
            </Typography>
          </div>
          <AppReactApexCharts type='bar' height={163} width='100%' series={series} options={options} />
        </div> */}
        <div className='flex flex-col sm:flex-row gap-6 p-2 border rounded'>
          {data.map((item, index) => (
            <div key={index} className='flex flex-col gap-2 is-full'>
              <div className='flex items-center gap-2 mb-6'>
                <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={26}>
                  <i className={classnames(item.avatarIcon, 'text-lg')} />
                </CustomAvatar>
                <Typography variant='h6' className='leading-6 font-normal'>
                  {item.title}
                </Typography>
              </div>
              <Typography variant='h4'>{item.stats}</Typography>
              <LinearProgress
                value={item.progress}
                variant='determinate'
                color={item.progressColor}
                className='max-bs-1'
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default EarningReports
