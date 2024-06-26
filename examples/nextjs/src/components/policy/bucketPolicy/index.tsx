import { client } from '@/client';
import {
  GRNToString,
  newBucketGRN,
  PermissionTypes,
  toTimestamp,
} from '@bnb-chain/greenfield-js-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const BucketPolicy = () => {
  const { address } = useAccount();
  const [policyBucketInfo, setBucketGroupInfo] = useState({
    bucketName: '',
  });

  return (
    <>
      <h4>Bucket Policy</h4>
      bucket name :
      <input
        value={policyBucketInfo.bucketName}
        placeholder="bucket name"
        onChange={(e) => {
          setBucketGroupInfo({ ...policyBucketInfo, bucketName: e.target.value });
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const date = new Date();
          date.setDate(date.getMinutes() + 10);

          const statement: PermissionTypes.Statement = {
            effect: PermissionTypes.Effect.EFFECT_ALLOW,
            actions: [PermissionTypes.ActionType.ACTION_UPDATE_BUCKET_INFO],
            resources: [GRNToString(newBucketGRN(policyBucketInfo.bucketName))],
            expirationTime: toTimestamp(date),
          };

          const tx = await client.bucket.putBucketPolicy(policyBucketInfo.bucketName, {
            operator: address,
            statements: [statement],
            principal: {
              type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
              value: '0x0000000000000000000000000000000000000001',
            },
            expirationTime: toTimestamp(date),
          });

          const simulateInfo = await tx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await tx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        put bucket policy
      </button>
      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.bucket.deleteBucketPolicy(
            address,
            policyBucketInfo.bucketName,
            address,
            'PRINCIPAL_TYPE_GNFD_ACCOUNT',
          );

          const simulateInfo = await tx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await tx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        delete bucket policy
      </button>
      {/* <button onClick={async () => {
        if (!address) return;

        const principal: PermissionTypes.Principal = {

        }

        await client.storage.deletePolicy({
          operator: address,
          principal,
          resource:
        })
      }}>
        xx
      </button> */}
    </>
  );
};
