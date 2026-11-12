const {PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');
const p=new PrismaClient();
(async()=>{await p.user.upsert({where:{email:'admin@depok.go.id'},update:{},create:{nama:'Admin Disrumkim',nik:'0000000000000000',email:'admin@depok.go.id',password:await bcrypt.hash('admin123',10),role:'admin'}});
console.log('Admin: admin@depok.go.id / admin123');process.exit(0)})();
