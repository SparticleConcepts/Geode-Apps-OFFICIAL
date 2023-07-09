// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../translate';
import type { CallResult } from '../shared/types';
import styled from 'styled-components';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Badge, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline';
import { useToggle, useDebounce } from '@polkadot/react-hooks';

import AccountHeader from '../shared/AccountHeader';
import CallSendMessage from './CallSendMessage';

//import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    onClose: boolean;
  }

  type BranchsObj = {
    branchId: string,
    programId: string,
    branch: string[]
  }

  type PayoutsObj = {
    payoutId: string,
    programId: string,
    claimId: string,
    childAccount: string,
    childPayout: number,
    parentAccount: string,
    parentPayout: number,
    grandparentAccount: string,
    grandparentPayout: number,
    timestamp: number,
    totalPayout: number
  }

  type ClaimsObj = {
    programId: string,
    claimId: string,
    parent: string,
    parentIp: string,
    child: string,
    childIp: string,
    timestamp: number,
    grandparent: string,
    branch: string[],
    payIn: number,
    endorsedBy: string,
    payoutId: string,
    status: number
  }
  
  type ProgramObj = {
    programId: string,
    owner: string,
    title: string,
    description: string,
    moreInfoLink: string,
    photo: string,
    firstLevelReward: number,
    secondLevelReward: number,
    maximumRewards: number,
    rewardsGiven: number,
    ownerApprovalRequired: boolean,
    payInMinimum: number,
    programBalance: number,
    claimsEndorsedApproved: ClaimsObj[],
    claimsEndorsedRejected: ClaimsObj[],
    claimsEndorsedWaiting: ClaimsObj[],
    claimsMade: ClaimsObj[],
    branches: BranchsObj[],
    payouts: PayoutsObj[],
    active: boolean
  }
  
  type Program = {
    programs: ProgramObj[]
  }

  type ProgramDetail = {
  ok: Program
  }
  
function MyProgramsDetails ({ className = '', onClear, onClose, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
   // const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    //const [modalEnum, setModalEnum] = useState(['','','','','',0,0,0,false,0]);
    
    const [useProgramId, setProgramId] = useState('');
    const [useTitle, setTitle] = useState('');
    const [useDescription, setDescription] = useState('');
    const [useMoreInfoLink, setMoreInfoLink] = useState('');
    const [usePhoto, setPhoto] = useState('');
    const [useFirstLevelReward, setFirstLevelReward] = useState(0);
    const [useSecondLevelReward, setSecondLevelReward] = useState(0);
    const [useMaxRewards, setMaxRewards] = useState(0);
    const [useOwnerApprovedRequired, setOwnerApprovedRequired] = useState(false);
    const [usePayInMinimum, setPayInMinimum] = useState(0);
    const [useClaimId, setClaimId] = useState('');

    const [dbIsFund, setFund] = useState(false);
    const [isUpdate, setUpdate] = useState(false);
    const [isDeactivate, setDeactivate] = useState(false);
    const [isActivate, setActivate] = useState(false);
    const [isApprove, setApprove] = useState(false);
    const [isReject, setReject] = useState(false);
    
    //const [isReset, toggleReset] = useToggle(false);
    
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const programDetail: ProgramDetail = Object.create(_Obj);
    
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    const [isNewProgram, toggleNewProgram] = useToggle(false);
    //const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
    //const dbIsFund = useDebounce(isFund);
    //const shortAccount = (_acctAddrs: string) => _acctAddrs.length>0? _acctAddrs.slice(0, 5)+'..': '';
    const shortClaimId = (_claimId: string) => _claimId.length>0? _claimId.slice(0, 7)+'..': ''; 

    const _reset = useCallback(
      () => {setFund(false);
             setUpdate(false);
             setDeactivate(false);
             setActivate(false);
             setApprove(false);
             setReject(false);
            },
      [dbIsFund, isUpdate, isDeactivate, isActivate, isApprove, isReject]
    )
    
    const _makeFund = useCallback(
      () => {setFund(true);
             setUpdate(false);
             setDeactivate(false);
             setActivate(false);
             setApprove(false);
             setReject(false);
             //toggleReset();
            },
      [dbIsFund, isUpdate, isDeactivate, isActivate, isApprove, isReject]
    )
    
    const _makeUpdate = useCallback(
      () => {setFund(false);
             setUpdate(true);
             setDeactivate(false);
             setActivate(false);
             setApprove(false);
             setReject(false);
            },
      [dbIsFund, isUpdate, isDeactivate, isActivate, isApprove, isReject]
    )
    
    const _makeDeactivate = useCallback(
      () => {setFund(false);
             setUpdate(false);
             setDeactivate(true);
             setActivate(false);
             setApprove(false);
             setReject(false);
            },
      [dbIsFund, isUpdate, isDeactivate, isActivate, isApprove, isReject]
    )
    
    const _makeActivate = useCallback(
      () => {setFund(false);
             setUpdate(false);
             setDeactivate(false);
             setActivate(true);
             setApprove(false);
             setReject(false);
            },
      [dbIsFund, isUpdate, isDeactivate, isActivate, isApprove, isReject]
    )

    const _makeApprove = useCallback(
      () => {setFund(false);
             setUpdate(false);
             setDeactivate(false);
             setActivate(false);
             setApprove(true);
             setReject(false);
            },
      [dbIsFund, isUpdate, isDeactivate, isActivate, isApprove, isReject]
    )


    function showAddress(_acct: string): JSX.Element {
      return(<>
      {_acct.length>0? 
                <><IdentityIcon value={_acct} />{' '}
                  <AccountName value={_acct} withSidebar={true}/>
                  {' '}    
                </>: <>{''}</>}
            </>)
    }

    function timeStampToDate(tstamp: number): JSX.Element {
        try {
         const event = new Date(tstamp);
         return (
              <><i>{event.toDateString()}{' '}
                   {event.toLocaleTimeString()}{' '}</i></>
          )
        } catch(error) {
         console.error(error)
         return(
             <><i>{t<string>('No Date')}</i></>
         )
        }
     }

     function renderLink(_link: string): JSX.Element {
        const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
        const videoLink: string = (ilink.includes('embed')) ? ilink 
                : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
                  : ('https://www.youtube.com/embed/' + ilink.slice(32));
      
        return(
          <>
          {ilink.trim() != 'http://' ? (<>
            {(ilink).includes('youtu')? (
            <iframe width="250" height="145" src={videoLink +'?autoplay=0&mute=1'}> 
            </iframe>) : (
            <Image bordered rounded src={ilink} size='small' />
            )}    
          </>) : <>{''}</>}
          <br /></>
        )
      }
      
      function BNtoGeode(_num: number): JSX.Element {
        return(<>
            {_num>0? <>{(_num/1000000000000).toString()}{' Geode'}</>: <>{'0'}</>}
        </>)
      }

      function booleanToHuman(_bool: boolean): JSX.Element {
        return(<>
        <Badge 
                isSmall
                icon={_bool? 'thumbs-up': 'thumbs-down'}
                color={_bool? 'blue': 'red'}
                info={_bool? 'Yes': 'No'}              
               />
        </>
        )
      }

      function booleanToStatus(_bool: boolean): JSX.Element {
        return(<>
        <Label
            circular
            size='mini'
            color={_bool? 'blue': 'red'}>
        {_bool? 'Active': 'Inactive'}
        </Label>
        </>)
      }

      function linkToButton(_link: string): JSX.Element {
        return(<>
          <Label  as='a'
                  color='orange'
                  circular
                  size={'mini'}
                  href={isHex(_link) ? withHttp(hexToString(_link).trim()) : ''} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  >{t<string>('Link')}
          </Label>
        </>)
      }

      function hextoHuman(_hexIn: string): string {
        const _Out: string = (isHex(_hexIn))? t<string>(hexToString(_hexIn).trim()): '';
        return(_Out)
      }
      
    function ShowSubMenus(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t<string>('Close')}
                  onClick={onClear}
                />
              <Button
                  icon={isNewProgram? 'minus': 'plus'}
                  label={t<string>('New Program')}
                  onClick={()=> {<>{toggleNewProgram()}{_reset()}</>}}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}
      
      function ShowPrograms(): JSX.Element {
        try{
          return(
            <div>
              <Table>
                <Table.Row>
                <Table.Cell verticalAlign='top'>
                {programDetail.ok.programs.length>0 && programDetail.ok.programs.map((_programs, index: number) => <>
                  <Grid columns={4} divided>
                    <Grid.Row>
                      <Grid.Column>
                        {renderLink(_programs.photo)}
                        <Label as='a' size='small' 
                                color={'orange'}
                                onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {_makeFund()}
                                          </>}} >{'Fund'}</Label>

                        <Label as='a' size='small' color='orange'
                                onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {setMoreInfoLink(_programs.moreInfoLink)}
                                       {setPhoto(_programs.photo)}
                                       {setFirstLevelReward(_programs.firstLevelReward)}
                                       {setSecondLevelReward(_programs.secondLevelReward)}
                                       {setMaxRewards(_programs.maximumRewards)}
                                       {setOwnerApprovedRequired(_programs.ownerApprovalRequired)}
                                       {setPayInMinimum(_programs.payInMinimum)}
                                       {_makeUpdate()}
                                       </>}} >{'Update'}</Label>

                        <Label as='a' size='small' color='orange'
                                onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {_makeDeactivate()}
                                       </>}} >{'Deactivate'}</Label>

                        <Label as='a' size='small' color='orange'
                               onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {_makeActivate()}
                                       </>}} >{'Reactivate'}</Label>
                      </Grid.Column>
                      <Grid.Column>
                      <h3><strong>{t<string>('Title: ')}</strong>{hextoHuman(_programs.title)}</h3>
                          <strong>{t<string>('Description: ')}</strong>{hextoHuman(_programs.description)}<br />
                          <strong>{t<string>('1st level reward: ')}</strong>{BNtoGeode(_programs.firstLevelReward)}<br />
                          <strong>{t<string>('2nd level reward: ')}</strong>{BNtoGeode(_programs.secondLevelReward)}<br />
                          <strong>{t<string>('Maximum number of rewards: ')}</strong>{_programs.maximumRewards}<br />
                          <strong>{t<string>('Rewards Given: ')}</strong>{_programs.rewardsGiven}<br />
                          <strong>{t<string>('Owner approval needed to trigger reward: ')}</strong>{booleanToHuman(_programs.ownerApprovalRequired)}<br />
                          <strong>{t<string>('Pay It Forward Minimum: ')}</strong>{BNtoGeode(_programs.payInMinimum)}<br />
                          <strong>{t<string>('More Info Link: ')}</strong>{linkToButton(_programs.moreInfoLink)}<br />
                          <strong>{t<string>('Program Account Balance: ')}</strong>{BNtoGeode(_programs.programBalance)}<br />
                          <strong>{t<string>('Program Status: ')}</strong>{booleanToStatus(_programs.active)}<br />
                          {_programs.ownerApprovalRequired && _programs.claimsEndorsedWaiting.length>0 && (<>
                            <strong>{t<string>('Endorsements Waiting For Owner Approval:')}</strong><br />
                            {_programs.claimsEndorsedWaiting.map(_claim => <>
                              <strong>{'Claim ID: '}</strong>{shortClaimId(_claim.claimId)}<br />
                              {timeStampToDate(_claim.timestamp)}<br />

                              {'(child) '}{showAddress(_claim.child)}
                              {'(grandpa) '}{showAddress(_claim.grandparent)}
                              {' -> '}{'(parent) '}{showAddress(_claim.parent)}
                              {' -> '}{'(child) '}{showAddress(_claim.child)}
                              <br /><br />
                              {_claim.status===1 && (<>
                                {' '}<Label as='a' 
                                          circular color='orange'
                                          onClick={()=>{<>
                                            {setProgramId(_programs.programId)}
                                            {setTitle(_programs.title)}
                                            {setDescription(_programs.description)}
                                            {setClaimId(_claim.claimId)}
                                            {_makeApprove()}
                                            </>}} >
                                   {'Approve'}</Label>                                                                                    
                              </>)}
                              {' '}<Label as='a' circular color='orange'>{'Reject'}</Label>
                            </>)}
                          </>)}
                         
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                      </>)}
                </Table.Cell>
                </Table.Row>
              </Table>
            </div>
        )
        } catch(e) {
          console.log(e);
          return(
            <div>
              <Card>{t<string>('No Programs to Show')}</Card>
            </div>
          )    
        } 
      }        

  return (
    <StyledDiv className={className}>
    <Card>
      <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={2}/>
      <ShowSubMenus />
      {isNewProgram && !dbIsFund && !isUpdate && !isDeactivate && !isActivate &&  (
      <CallSendMessage
         callIndex={2}
         isModal={false}
         onClear={() => _reset()}
      />
      )}
      {!isNewProgram && dbIsFund && !isUpdate && !isDeactivate && !isActivate && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         callIndex={3}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      {!isNewProgram && !dbIsFund && isUpdate && !isDeactivate && !isActivate && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         moreInfoLink={useMoreInfoLink}
         photo={usePhoto}
         firstLevelReward={useFirstLevelReward}
         secondLevelReward={useSecondLevelReward}
         maximumReward={useMaxRewards}
         ownerApprovedRequired={useOwnerApprovedRequired}
         payInMinimum={usePayInMinimum}
         callIndex={4}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      {!isNewProgram && !dbIsFund && !isUpdate && isDeactivate && !isActivate &&  (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         callIndex={5}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      {!isNewProgram && !dbIsFund && !isUpdate && !isDeactivate && isActivate && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         callIndex={6}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      {isApprove && !isReject && !isNewProgram && 
       !dbIsFund && !isUpdate && !isDeactivate && 
       !isActivate && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         claimId={useClaimId}
         callIndex={7}
         isModal={true}
         onClear={() => _reset()}
        />
      )}
      <ShowPrograms />
    </Card>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`;
export default React.memo(MyProgramsDetails);
