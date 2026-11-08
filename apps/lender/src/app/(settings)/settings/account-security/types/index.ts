export interface Challenge {
  challengeId: string;
}

export interface CodeDto {
  challengeId: string;
  code: string;
}

export interface EmailChangeDto {
  stepUpChallengeId: string;
  email: string;
}
