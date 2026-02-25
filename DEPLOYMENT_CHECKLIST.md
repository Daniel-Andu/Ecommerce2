# Deployment Checklist

## Pre-Deployment

### Backend
- [ ] All environment variables configured in .env
- [ ] Database migrations completed (`npm run setup-features`)
- [ ] SMTP credentials configured for email notifications
- [ ] Chapa payment gateway credentials configured
- [ ] CORS origins updated with production URLs
- [ ] JWT secret is strong and secure
- [ ] File upload directories exist and have proper permissions
- [ ] Database connection tested
- [ ] All dependencies installed (`npm install`)

### Frontend
- [ ] API URL updated to production backend
- [ ] Environment variables configured
- [ ] Build tested locally (`npm run build`)
- [ ] All assets optimized
- [ ] Error boundaries implemented

### Admin Frontend
- [ ] API URL updated to production backend
- [ ] Environment variables configured
- [ ] Build tested locally
- [ ] Admin credentials secured

## Database Setup

- [ ] Create production database
- [ ] Run initial schema: `backend/scripts/schema.sql`
- [ ] Run migrations: `backend/scripts/migrations.sql`
- [ ] Create admin user: `node backend/scripts/createAdmin.js`
- [ ] Seed initial data (optional): `npm run seed`
- [ ] Verify all tables created
- [ ] Set up database backups
- [ ] Configure database connection pooling

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Enable helmet security headers
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Set proper file permissions (755 for directories, 644 for files)

## Email Configuration

- [ ] SMTP credentials configured
- [ ] Test email sending
- [ ] Configure email templates
- [ ] Set up email delivery monitoring
- [ ] Configure SPF/DKIM records for domain

## Payment Gateway

- [ ] Chapa production credentials configured
- [ ] Test payment flow in production
- [ ] Configure webhook URLs
- [ ] Set up payment failure notifications
- [ ] Test refund process

## File Storage

- [ ] Create upload directories:
  - `backend/uploads/products`
  - `backend/uploads/categories`
  - `backend/uploads/profile-images`
  - `backend/uploads/returns`
- [ ] Set proper permissions (755)
- [ ] Configure CDN (optional)
- [ ] Set up backup for uploaded files

## Performance Optimization

- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Enable connection pooling
- [ ] Configure CDN for static assets
- [ ] Implement Redis caching (optional)

## Monitoring & Logging

- [ ] Set up error logging
- [ ] Configure application monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log rotation
- [ ] Set up alerts for critical errors
- [ ] Monitor database performance
- [ ] Track API response times

## Testing in Production

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test order placement
- [ ] Test payment flow
- [ ] Test email notifications
- [ ] Test return requests
- [ ] Test withdrawal requests
- [ ] Test admin functions
- [ ] Test seller functions
- [ ] Test search functionality
- [ ] Test coupon application

## Post-Deployment

- [ ] Verify all API endpoints working
- [ ] Check email notifications
- [ ] Test payment gateway
- [ ] Monitor error logs
- [ ] Check database connections
- [ ] Verify file uploads working
- [ ] Test mobile responsiveness
- [ ] Check SSL certificate
- [ ] Verify CORS configuration
- [ ] Test all user roles (customer, seller, admin)

## Backup Strategy

- [ ] Set up automated database backups (daily)
- [ ] Set up file storage backups (weekly)
- [ ] Test backup restoration
- [ ] Document backup procedures
- [ ] Set up off-site backup storage

## Documentation

- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create admin user guide
- [ ] Create seller user guide
- [ ] Document troubleshooting steps
- [ ] Update README with production URLs

## Scaling Considerations

- [ ] Configure load balancer (if needed)
- [ ] Set up database replication (if needed)
- [ ] Configure auto-scaling (if needed)
- [ ] Optimize database queries
- [ ] Implement caching strategy
- [ ] Monitor resource usage

## Rollback Plan

- [ ] Document rollback procedure
- [ ] Keep previous version accessible
- [ ] Test rollback process
- [ ] Have database backup ready
- [ ] Document known issues

## Launch Checklist

- [ ] All features tested
- [ ] All bugs fixed
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Monitoring in place
- [ ] Backups configured
- [ ] Documentation complete
- [ ] Support team trained
- [ ] Marketing materials ready
- [ ] Launch announcement prepared

## Environment-Specific URLs

### Development
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Admin: http://localhost:3001

### Production
- Backend: https://api.yourdomain.com
- Frontend: https://yourdomain.com
- Admin: https://admin.yourdomain.com

## Support Contacts

- DevOps: devops@example.com
- Backend: backend@example.com
- Frontend: frontend@example.com
- Database: dba@example.com

## Emergency Procedures

### If Site Goes Down
1. Check server status
2. Check database connection
3. Check error logs
4. Restart services if needed
5. Notify team
6. Update status page

### If Payment Fails
1. Check Chapa API status
2. Check webhook configuration
3. Check error logs
4. Contact Chapa support
5. Notify affected customers

### If Database Issues
1. Check connection pool
2. Check disk space
3. Check slow queries
4. Restart database if needed
5. Restore from backup if necessary

## Post-Launch Monitoring (First 24 Hours)

- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Monitor database performance
- [ ] Check email delivery
- [ ] Monitor payment success rate
- [ ] Check user registration flow
- [ ] Monitor server resources
- [ ] Review user feedback

## Weekly Maintenance

- [ ] Review error logs
- [ ] Check database performance
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Check backup integrity
- [ ] Monitor disk space
- [ ] Review user feedback

## Monthly Tasks

- [ ] Security audit
- [ ] Performance review
- [ ] Database optimization
- [ ] Update documentation
- [ ] Review analytics
- [ ] Plan feature updates
