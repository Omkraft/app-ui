import { Icon, type LucideProps } from 'lucide-react';
import { cricketWicket, volleyball, shorts, hockey, tennisRacket, football } from '@lucide/lab';
import { createElement, type ComponentType } from 'react';

export type SportIcon = ComponentType<LucideProps>;

function createLabIcon(iconNode: Parameters<typeof Icon>[0]['iconNode']): SportIcon {
	return (props) => createElement(Icon, { iconNode, ...props });
}

export const sportIcons: Record<string, SportIcon> = {
	cricket: createLabIcon(cricketWicket),
	football: createLabIcon(volleyball),
	kabaddi: createLabIcon(shorts),
	hockey: createLabIcon(hockey),
	tennis: createLabIcon(tennisRacket),
	rugby: createLabIcon(football),
};
