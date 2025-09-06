// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { Avatar, Box, Button, Icon, Typography } from '@mui/material'
import Link from '@/components/Link'
import { BUYER_URL, URL_SITE } from '@/settings'
import { useAuthStore } from '@/contexts/AuthContext'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { useEffect } from 'react'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const { user, signOut, profile, getUserById } = useAuthStore();

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  useEffect(() => {
    if (user) {
      getUserById(user._id);
    }
  }, [user]);

  const permissions = profile?.permissions;

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        // menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {(permissions?.includes('dashboard') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/crm`} icon={<i className='tabler-dashboard' />}>
            Vue générale
          </MenuItem>
        )}
        {(permissions?.includes('categories') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/category`} icon={<i className='tabler-category' />}>
            Mes Catégories
          </MenuItem>
        )}
        {(permissions?.includes('view_products') || permissions?.includes('add_products') || permissions?.includes('all')) && (
          <SubMenu label={'Gestion des produits'} icon={<i className='tabler-building' />}>
            {(permissions?.includes('view_products') || permissions?.includes('all')) && (
              <MenuItem href={`/${locale}/dashboards/products/list`} icon={<i className='tabler-list' />}>
                Liste
              </MenuItem>
            )}
            {(permissions?.includes('add_products') || permissions?.includes('all')) && (
              <MenuItem href={`/${locale}/dashboards/product-add`} icon={<i className='tabler-plus' />}>
                Ajouter
              </MenuItem>
            )}
          </SubMenu>
        )}
        {(permissions?.includes('orders') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/orders/list`} icon={<i className='tabler-list' />}>
            Mes Commandes
          </MenuItem>
        )}
        {(permissions?.includes('payments') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/payments/list`} icon={<i className='tabler-credit-card' />}>
            Paiements
          </MenuItem>
        )}
        {(permissions?.includes('subscription') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/subscription`} label={dictionary['navigation'].customers} icon={<i className='tabler-user-check' />}>
            Mes Abonnements
          </MenuItem>
        )}
        {(permissions?.includes('codePromo') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/promoCode`} label={dictionary['navigation'].customers} icon={<i className='tabler-user-check' />}>
            Mes Codes promos
          </MenuItem>
        )}
         {(permissions?.includes('statistics') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/statistics`} label={dictionary['navigation'].customers} icon={<i className='tabler-chart-bar' />}>
            Statistiques
          </MenuItem>
        )}
        {(permissions?.includes('customers') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/customers/list`} label={dictionary['navigation'].customers} icon={<i className='tabler-users' />}>
            Mes Clients
          </MenuItem>
        )}
        {(permissions?.includes('reviews') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/reviews`} icon={<i className='tabler-star' />}>
            Commentaires
          </MenuItem>
        )}
        {(permissions?.includes('admin') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/admin`} icon={<i className='tabler-users' />}>
            Administrateurs
          </MenuItem>
        )}
        {(permissions?.includes('newsletter') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/newsletter`} icon={<i className='tabler-mail' />}>
            Newsletters
          </MenuItem>
        )}
        {(permissions?.includes('settings') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/settings`} icon={<i className='tabler-settings' />}>
            Paramètres
          </MenuItem>
        )}
        {/* {(permissions?.includes('support') || permissions?.includes('all')) && (
          <MenuItem href={`/${locale}/dashboards/support`} icon={<i className='tabler-help-circle' />}>
            Supports
          </MenuItem>
        )} */}

        {/* <MenuItem href={`/${locale}/dashboards/advertisement`} icon={<i className='tabler-tag' />}>
          Annonces
        </MenuItem> */}


          <Box className="mt-6 bottom-5 w-[90%] py-3"
            sx={{ borderTop: '1px solid #ccc', padding: '10px' }}>
            <Box className="mb-4 flex items-center gap-4">
              <Avatar skin='light' size={34} className='m-0' />
              <Typography>{user?.name || 'Administrateur'}</Typography>
            </Box>
            <Button
              variant="contained"
              color="error"
              // color=''
              onClick={signOut}
              className="flex align-center gap-4 w-full"
            >
              <i className='tabler-logout'></i>
              Déconnexion
            </Button>
          </Box>
        {/* <SubMenu label={dictionary['navigation'].frontPages} icon={<i className='tabler-files' />}>
          <MenuItem href='/front-pages/landing-page' target='_blank'>
            {dictionary['navigation'].landing}
          </MenuItem>
          <MenuItem href='/front-pages/pricing' target='_blank'>
            {dictionary['navigation'].pricing}
          </MenuItem>
          <MenuItem href='/front-pages/payment' target='_blank'>
            {dictionary['navigation'].payment}
          </MenuItem>
          <MenuItem href='/front-pages/checkout' target='_blank'>
            {dictionary['navigation'].checkout}
          </MenuItem>
          <MenuItem href='/front-pages/help-center' target='_blank'>
            {dictionary['navigation'].helpCenter}
          </MenuItem>
        </SubMenu> */}
       
       
        {/* <MenuItem href={`/${locale}/apps/ecommerce/settings`}>{dictionary['navigation'].settings}</MenuItem>
        <MenuItem href={`/${locale}/pages/user-profile`}>{dictionary['navigation'].userProfile}</MenuItem>
        <MenuItem href={`/${locale}/pages/account-settings`}>{dictionary['navigation'].accountSettings}</MenuItem>
        <MenuItem href={`/${locale}/pages/widget-examples/statistics`}>
          {dictionary['navigation'].statistics}
        </MenuItem> */}
        {/* <MenuSection label={dictionary['navigation'].appsPages}>  */}
          {/* <SubMenu label={dictionary['navigation'].eCommerce} icon={<i className='tabler-shopping-cart' />}>
            <MenuItem href={`/${locale}/apps/ecommerce/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/ecommerce/referrals`}>{dictionary['navigation'].referrals}</MenuItem>
          </SubMenu> */}
          {/* <SubMenu label={dictionary['navigation'].academy} icon={<i className='tabler-school' />}>
            <MenuItem href={`/${locale}/apps/academy/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/my-courses`}>{dictionary['navigation'].myCourses}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/course-details`}>
              {dictionary['navigation'].courseDetails}
            </MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].logistics} icon={<i className='tabler-truck' />}>
            <MenuItem href={`/${locale}/apps/logistics/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/logistics/fleet`}>{dictionary['navigation'].fleet}</MenuItem>
          </SubMenu> */}
          {/* <MenuItem
            href={`/${locale}/apps/email`}
            icon={<i className='tabler-mail' />}
            exactMatch={false}
            activeUrl='/apps/email'
          >
            {dictionary['navigation'].email}
          </MenuItem> */}
         
         {/*  <MenuItem href={`/${locale}/apps/calendar`} icon={<i className='tabler-calendar' />}>
            {dictionary['navigation'].calendar}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/kanban`} icon={<i className='tabler-copy' />}>
            {dictionary['navigation'].kanban}
          </MenuItem> */}
         
         
          {/* <SubMenu label={dictionary['navigation'].rolesPermissions} icon={<i className='tabler-lock' />}>
            <MenuItem href={`/${locale}/apps/roles`}>{dictionary['navigation'].roles}</MenuItem>
            <MenuItem href={`/${locale}/apps/permissions`}>{dictionary['navigation'].permissions}</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].pages} icon={<i className='tabler-file' />}>

            <MenuItem href={`/${locale}/pages/faq`}>{dictionary['navigation'].faq}</MenuItem>
            <MenuItem href={`/${locale}/pages/pricing`}>{dictionary['navigation'].pricing}</MenuItem>
            <SubMenu label={dictionary['navigation'].miscellaneous}>
              <MenuItem href={`/${locale}/pages/misc/coming-soon`} target='_blank'>
                {dictionary['navigation'].comingSoon}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/misc/under-maintenance`} target='_blank'>
                {dictionary['navigation'].underMaintenance}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/misc/404-not-found`} target='_blank'>
                {dictionary['navigation'].pageNotFound404}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/misc/401-not-authorized`} target='_blank'>
                {dictionary['navigation'].notAuthorized401}
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].authPages} icon={<i className='tabler-shield-lock' />}>
            <SubMenu label={dictionary['navigation'].login}>
              <MenuItem href={`/${locale}/pages/auth/login-v1`} target='_blank'>
                {dictionary['navigation'].loginV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/login-v2`} target='_blank'>
                {dictionary['navigation'].loginV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].register}>
              <MenuItem href={`/${locale}/pages/auth/register-v1`} target='_blank'>
                {dictionary['navigation'].registerV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/register-v2`} target='_blank'>
                {dictionary['navigation'].registerV2}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/register-multi-steps`} target='_blank'>
                {dictionary['navigation'].registerMultiSteps}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].verifyEmail}>
              <MenuItem href={`/${locale}/pages/auth/verify-email-v1`} target='_blank'>
                {dictionary['navigation'].verifyEmailV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/verify-email-v2`} target='_blank'>
                {dictionary['navigation'].verifyEmailV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].forgotPassword}>
              <MenuItem href={`/${locale}/pages/auth/forgot-password-v1`} target='_blank'>
                {dictionary['navigation'].forgotPasswordV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/forgot-password-v2`} target='_blank'>
                {dictionary['navigation'].forgotPasswordV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].resetPassword}>
              <MenuItem href={`/${locale}/pages/auth/reset-password-v1`} target='_blank'>
                {dictionary['navigation'].resetPasswordV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/reset-password-v2`} target='_blank'>
                {dictionary['navigation'].resetPasswordV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].twoSteps}>
              <MenuItem href={`/${locale}/pages/auth/two-steps-v1`} target='_blank'>
                {dictionary['navigation'].twoStepsV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/two-steps-v2`} target='_blank'>
                {dictionary['navigation'].twoStepsV2}
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].wizardExamples} icon={<i className='tabler-dots' />}>
            <MenuItem href={`/${locale}/pages/wizard-examples/checkout`}>{dictionary['navigation'].checkout}</MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/property-listing`}>
              {dictionary['navigation'].propertyListing}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/create-deal`}>
              {dictionary['navigation'].createDeal}
            </MenuItem>
          </SubMenu>
          <MenuItem href={`/${locale}/pages/dialog-examples`} icon={<i className='tabler-square' />}>
            {dictionary['navigation'].dialogExamples}
          </MenuItem>
         <SubMenu label={dictionary['navigation'].widgetExamples} icon={<i className='tabler-chart-bar' />}>
            <MenuItem href={`/${locale}/pages/widget-examples/basic`}>{dictionary['navigation'].basic}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/advanced`}>{dictionary['navigation'].advanced}</MenuItem>
             
            <MenuItem href={`/${locale}/pages/widget-examples/statistics`}>
              {dictionary['navigation'].statistics}
            </MenuItem> 
           <MenuItem href={`/${locale}/pages/widget-examples/charts`}>{dictionary['navigation'].charts}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/actions`}>{dictionary['navigation'].actions}</MenuItem>
          </SubMenu>
        </MenuSection> 
       <MenuSection label={dictionary['navigation'].formsAndTables}>
          <MenuItem href={`/${locale}/forms/form-layouts`} icon={<i className='tabler-layout' />}>
            {dictionary['navigation'].formLayouts}
          </MenuItem>
          <MenuItem href={`/${locale}/forms/form-validation`} icon={<i className='tabler-checkup-list' />}>
            {dictionary['navigation'].formValidation}
          </MenuItem>
          <MenuItem href={`/${locale}/forms/form-wizard`} icon={<i className='tabler-git-merge' />}>
            {dictionary['navigation'].formWizard}
          </MenuItem>
          <MenuItem href={`/${locale}/react-table`} icon={<i className='tabler-table' />}>
            {dictionary['navigation'].reactTable}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-checkbox' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation'].formELements}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-layout-board-split' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation'].muiTables}
          </MenuItem>
        </MenuSection> 
        <MenuSection label={dictionary['navigation'].chartsMisc}>
          <SubMenu label={dictionary['navigation'].charts} icon={<i className='tabler-chart-donut-2' />}>
            <MenuItem href={`/${locale}/charts/apex-charts`}>{dictionary['navigation'].apex}</MenuItem>
            <MenuItem href={`/${locale}/charts/recharts`}>{dictionary['navigation'].recharts}</MenuItem>
          </SubMenu>
          <MenuItem
            icon={<i className='tabler-cards' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation'].foundation}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-atom' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation'].components}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-list-search' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation'].menuExamples}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-lifebuoy' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            href='https://pixinvent.ticksy.com'
          >
            {dictionary['navigation'].raiseSupport}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-book-2' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}`}
          >
            {dictionary['navigation'].documentation}
          </MenuItem>
          <SubMenu label={dictionary['navigation'].others} icon={<i className='tabler-box' />}>
            <MenuItem suffix={<CustomChip label='New' size='small' color='info' round='true' />}>
              {dictionary['navigation'].itemWithBadge}
            </MenuItem>
            <MenuItem
              href='https://pixinvent.com'
              target='_blank'
              suffix={<i className='tabler-external-link text-xl' />}
            >
              {dictionary['navigation'].externalLink}
            </MenuItem>
            <SubMenu label={dictionary['navigation'].menuLevels}>
              <MenuItem>{dictionary['navigation'].menuLevel2}</MenuItem>
              <SubMenu label={dictionary['navigation'].menuLevel2}>
                <MenuItem>{dictionary['navigation'].menuLevel3}</MenuItem>
                <MenuItem>{dictionary['navigation'].menuLevel3}</MenuItem>
              </SubMenu>
            </SubMenu>
            <MenuItem disabled>{dictionary['navigation'].disabledMenu}</MenuItem>
          </SubMenu>
        </MenuSection>  */}
      </Menu>
      {/* <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <GenerateVerticalMenu menuData={menuData(dictionary)} />
        </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
