import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@edx/paragon';

export default function StatCard({ value, unit }) {
  return (
    <Card>
      <Card.Section className="text-center">
        <span className="display-2 d-block">{ value }</span>
        <span className="lead d-block">{ unit }</span>
      </Card.Section>
    </Card>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string.isRequired,
};