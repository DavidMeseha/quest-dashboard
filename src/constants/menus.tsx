import { CgPlayList, CgPlayListAdd } from 'react-icons/cg';

export const sideNav = [
  {
    to: '/create-product',
    icon: <CgPlayListAdd size={25} />,
    name: 'Create Product'
  },
  {
    to: '/products',
    icon: <CgPlayList size={25} />,
    name: 'Your Products'
  }
];
