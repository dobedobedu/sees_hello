import React from 'react';
import { motion } from 'framer-motion';
import './Bubble.css';

interface BubbleProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const Bubble: React.FC<BubbleProps> = ({ label, description, selected, onClick }) => {
  return (
    <motion.div
      className={`bubble ${selected ? 'selected' : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className='bubble-label'>{label}</span>
      {selected && (<span className='bubble-description'>{description}</span>)}
    </motion.div>
  );
};

export default Bubble;
