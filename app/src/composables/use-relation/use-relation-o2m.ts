import { useCollectionsStore, useFieldsStore, useRelationsStore } from '@/stores';
import { Collection, Field, Relation } from '@directus/shared/types';
import { computed, Ref } from 'vue';

export type RelationO2M = {
	relation: Relation;
	relatedCollection: Collection;
	relatedPrimaryKeyField: Field;
	reverseJunctionField: Field;
	sortField?: string;
	type: 'o2m';
};

/*
Many                 One: relatedCollection
┌──────────┐         ┌──────────────────────────────┐
│id        ├────┐    │id: relatedPKField            │
│many      │    └───►│many_id: reverseJunctionField │
└──────────┘         │sort: sortField               │
                     └──────────────────────────────┘
 */

export function useRelationO2M(collection: Ref<string>, field: Ref<string>) {
	const relationsStore = useRelationsStore();
	const collectionsStore = useCollectionsStore();
	const fieldsStore = useFieldsStore();

	const relationInfo = computed<RelationO2M | undefined>(() => {
		const relations = relationsStore.getRelationsForField(collection.value, field.value);

		if (relations.length !== 1) return undefined;

		const relation = relations[0];

		return {
			relation: relation,
			relatedCollection: collectionsStore.getCollection(relation.collection),
			relatedPrimaryKeyField: fieldsStore.getPrimaryKeyFieldForCollection(relation.collection),
			reverseJunctionField: fieldsStore.getField(relation.collection, relation.meta?.many_field as string),
			sortField: relation.meta?.sort_field ?? undefined,
			type: 'o2m',
		} as RelationO2M;
	});

	return { relationInfo };
}
