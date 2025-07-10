import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Matter } from '../../modules/matters/entities/matter.entity';
import { Contract } from '../../modules/contracts/entities/contract.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('Starting database seed...');

  const userRepository = dataSource.getRepository(User);
  const matterRepository = dataSource.getRepository(Matter);
  const contractRepository = dataSource.getRepository(Contract);

  // Create test users
  const users = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@counselflow.com',
      password: 'password123',
      role: 'admin',
      title: 'Senior Partner'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@counselflow.com',
      password: 'password123',
      role: 'lawyer',
      title: 'Associate'
    }
  ];

  console.log('Creating users...');
  const createdUsers = [];
  for (const userData of users) {
    let user = await userRepository.findOne({ where: { email: userData.email } });
    if (!user) {
      user = userRepository.create(userData);
      user = await userRepository.save(user);
      console.log(`Created user: ${userData.email}`);
    }
    createdUsers.push(user);
  }

  // Create test matters
  const matters = [
    {
      title: 'Corporate Restructuring - TechCorp Ltd',
      description: 'Advising on corporate restructuring and merger acquisition',
      clientName: 'TechCorp Ltd',
      status: 'active',
      priority: 'high',
      practiceArea: 'Corporate Law',
      assignedLawyerId: createdUsers[0].id
    },
    {
      title: 'Employment Contract Review - StartupCo',
      description: 'Review and draft employment contracts for startup company',
      clientName: 'StartupCo',
      status: 'active',
      priority: 'medium',
      practiceArea: 'Employment Law',
      assignedLawyerId: createdUsers[1].id
    }
  ];

  console.log('Creating matters...');
  for (const matterData of matters) {
    const matter = matterRepository.create(matterData);
    await matterRepository.save(matter);
    console.log(`Created matter: ${matterData.title}`);
  }

  // Create test contracts
  const contracts = [
    {
      title: 'Service Agreement - TechCorp',
      description: 'Professional services agreement with TechCorp',
      type: 'Service Agreement',
      status: 'draft',
      clientName: 'TechCorp Ltd',
      value: 50000
    },
    {
      title: 'NDA - StartupCo Partnership',
      description: 'Non-disclosure agreement for strategic partnership',
      type: 'NDA',
      status: 'active',
      clientName: 'StartupCo',
      value: 0
    }
  ];

  console.log('Creating contracts...');
  for (const contractData of contracts) {
    const contract = contractRepository.create(contractData);
    await contractRepository.save(contract);
    console.log(`Created contract: ${contractData.title}`);
  }

  console.log('Database seed completed successfully!');
}
