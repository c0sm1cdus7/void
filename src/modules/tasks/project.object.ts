import { objectType, text, enumeration, principal, ownershipPolicy } from 'desert-sdk/src/index.ts';
export const Project = objectType({id:'project',facts:{name:text({minLength:1,maxLength:64}),
  color:enumeration(['blue','violet','rose','green','amber','slate']),owner:principal()}});
export const PrivateProjects=ownershipPolicy(Project,'owner');
