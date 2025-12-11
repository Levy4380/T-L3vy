# Deployment Instructions for Vercel

## Important: Vendor Directory

Since Vercel's build environment doesn't have PHP/Composer available, you need to commit the `vendor/` directory to your repository.

### Steps to Deploy:

1. **Install Composer dependencies locally:**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. **Temporarily allow vendor/ in git:**
   ```bash
   # Remove vendor from .gitignore temporarily
   sed -i '/^\/vendor$/d' .gitignore
   ```

3. **Add and commit vendor/:**
   ```bash
   git add vendor/
   git add .gitignore
   git commit -m "Add vendor directory for Vercel deployment"
   git push
   ```

4. **Deploy to Vercel** - The build should now work since vendor/ is available.

### Alternative: Use GitHub Actions

If you prefer not to commit vendor/, you can use GitHub Actions to build and deploy:

1. Create `.github/workflows/deploy.yml`
2. Run `composer install` in the workflow
3. Deploy the built artifacts to Vercel

### Note

The `vendor/` directory is large (~50-100MB). Consider using Git LFS if your repository becomes too large.

