import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando sembrado de datos...')

  // Limpiar datos viejos
  await prisma.infraction.deleteMany()
  await prisma.competitor.deleteMany()
  await prisma.category.deleteMany()

  // 1. Crear Categorías
  await prisma.category.create({
    data: { name: 'Infantil', minAge: 0, maxAge: 12, fineAmount: 2000 },
  })
  await prisma.category.create({
    data: { name: 'Adolescente', minAge: 13, maxAge: 17, fineAmount: 5000 },
  })
  await prisma.category.create({
    data: { name: 'Adulto', minAge: 18, maxAge: 99, fineAmount: 10000 },
  })

  // 2. Crear Familia
  // Papá
  await prisma.competitor.create({
    data: {
      name: 'Papá',
      birthDate: new Date('1985-01-01'), // Ajusta la fecha si quieres
      favoriteColor: '#2563EB',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Papa&backgroundColor=b6e3f4',
    }
  })

  // Mamá
  await prisma.competitor.create({
    data: {
      name: 'Mamá',
      birthDate: new Date('1987-01-01'),
      favoriteColor: '#DB2777',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mama&backgroundColor=ffdfbf',
    }
  })

  // Hija 1
  await prisma.competitor.create({
    data: {
      name: 'Hija Mayor',
      birthDate: new Date('2010-01-01'),
      favoriteColor: '#9333EA',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hija1',
    }
  })
  
  // Hija 2
  await prisma.competitor.create({
    data: {
      name: 'Hija Menor',
      birthDate: new Date('2018-01-01'),
      favoriteColor: '#F59E0B',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hija2',
    }
  })

  console.log('✅ Familia creada correctamente.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })