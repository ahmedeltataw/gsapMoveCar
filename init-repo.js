import { execSync } from 'child_process';

// رابط المستودع بتاعك
const repoUrl = 'https://github.com/ahmedeltataw/gsapMoveCar.git';

try {
  console.log('🚀 Starting the ultimate Vite deployment...');


  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch (e) {
    console.log('📦 Initializing Git repository...');
    execSync('git init');
  }

  // 2. ضبط الـ Remote Origin
  try {
    const remotes = execSync('git remote').toString();
    if (remotes.includes('origin')) {
      console.log('🔗 Updating existing remote origin...');
      execSync(`git remote set-url origin ${repoUrl}`);
    } else {
      execSync(`git remote add origin ${repoUrl}`);
    }
  } catch (e) {
    execSync(`git remote add origin ${repoUrl}`);
  }

  // 3. إضافة الملفات وعمل Commit للسورس كود
  console.log('💾 Saving changes...');
  execSync('git add .');
  try {
    execSync('git commit -m "Automated update: Vite project"');
    console.log('✅ Changes committed.');
  } catch (e) {
    console.log('⚠️ No new changes in source code.');
  }

  // 4. رفع السورس كود لفرع main
  console.log('📤 Pushing source code to main branch...');
  execSync('git branch -M main');
  execSync('git push -u origin main --force');
  console.log('✔️ Source code is now on GitHub!');

  // 5. مرحلة الـ Build (تحويل كود Vite لملفات جاهزة)
  console.log('🏗️ Building project with Vite...');
  execSync('npm run build');

  // 6. رفع فولدر الـ dist لـ GitHub Pages
  console.log('🚀 Deploying "dist" folder to GitHub Pages...');
  // بنستخدم npx عشان نشغل gh-pages مباشرة
  execSync('npx gh-pages -d dist');

  console.log('✨ SUCCESS! Your site is live and your code is backed up.');

} catch (error) {
  console.error('❌ Error during deployment:', error.message);
  process.exit(1);
}